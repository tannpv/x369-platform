#!/bin/bash

# AWS Deployment Script for Car Rental Platform
# This script deploys the application to AWS using Terraform and ECS

set -e

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
AWS_REGION="${AWS_REGION:-us-west-2}"
PROJECT_NAME="${PROJECT_NAME:-carrental}"
ENVIRONMENT="${ENVIRONMENT:-prod}"
TERRAFORM_DIR="deployments/aws"

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Function to check if AWS CLI is configured
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install it first."
        echo "Visit: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
        exit 1
    fi
    
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS CLI is not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    print_status "AWS CLI is configured"
}

# Function to check if Terraform is installed
check_terraform() {
    if ! command -v terraform &> /dev/null; then
        print_error "Terraform is not installed. Please install it first."
        echo "Visit: https://learn.hashicorp.com/tutorials/terraform/install-cli"
        exit 1
    fi
    
    print_status "Terraform is available"
}

# Function to check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install it first."
        exit 1
    fi
    
    print_status "Docker is available"
}

# Function to build and push Docker images
build_and_push_images() {
    print_step "Building and pushing Docker images to ECR"
    
    # Get AWS account ID
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    
    # Login to ECR
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
    
    # Services to build
    services=("api-gateway" "user-service" "vehicle-service" "booking-service" "notification-service")
    
    for service in "${services[@]}"; do
        print_status "Building $service..."
        
        service_dir="backend/${service}"
        if [ ! -d "$service_dir" ]; then
            print_warning "Service directory $service_dir not found, skipping..."
            continue
        fi
        
        # Build Docker image
        docker build -t "$PROJECT_NAME/$service:latest" "$service_dir"
        
        # Tag for ECR
        ECR_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$PROJECT_NAME-$ENVIRONMENT/$service"
        docker tag "$PROJECT_NAME/$service:latest" "$ECR_URI:latest"
        docker tag "$PROJECT_NAME/$service:latest" "$ECR_URI:$(date +%Y%m%d-%H%M%S)"
        
        # Push to ECR
        print_status "Pushing $service to ECR..."
        docker push "$ECR_URI:latest"
        docker push "$ECR_URI:$(date +%Y%m%d-%H%M%S)"
        
        print_status "$service built and pushed successfully"
    done
}

# Function to deploy infrastructure
deploy_infrastructure() {
    print_step "Deploying infrastructure with Terraform"
    
    cd "$TERRAFORM_DIR"
    
    # Initialize Terraform
    terraform init
    
    # Plan deployment
    terraform plan -var-file="terraform.tfvars" -out="tfplan"
    
    # Apply deployment
    print_status "Applying Terraform configuration..."
    terraform apply "tfplan"
    
    # Save outputs
    terraform output -json > terraform-outputs.json
    
    cd - > /dev/null
    
    print_status "Infrastructure deployed successfully"
}

# Function to deploy ECS services
deploy_ecs_services() {
    print_step "Deploying ECS services"
    
    # Get Terraform outputs
    OUTPUTS_FILE="$TERRAFORM_DIR/terraform-outputs.json"
    
    if [ ! -f "$OUTPUTS_FILE" ]; then
        print_error "Terraform outputs file not found. Please run infrastructure deployment first."
        exit 1
    fi
    
    # Extract values from Terraform outputs
    ECS_CLUSTER=$(jq -r '.ecs_cluster_name.value' "$OUTPUTS_FILE")
    EXECUTION_ROLE_ARN=$(jq -r '.ecs_execution_role_arn.value' "$OUTPUTS_FILE")
    TASK_ROLE_ARN=$(jq -r '.ecs_task_role_arn.value' "$OUTPUTS_FILE")
    SUBNET_IDS=$(jq -r '.private_subnet_ids.value[]' "$OUTPUTS_FILE" | tr '\n' ',' | sed 's/,$//')
    SECURITY_GROUP=$(jq -r '.security_groups.value.ecs' "$OUTPUTS_FILE")
    TARGET_GROUP_ARN=$(jq -r '.target_group_arn.value' "$OUTPUTS_FILE")
    RDS_ENDPOINT=$(jq -r '.rds_endpoint.value' "$OUTPUTS_FILE")
    REDIS_ENDPOINT=$(jq -r '.redis_endpoint.value' "$OUTPUTS_FILE")
    LOG_GROUP=$(jq -r '.cloudwatch_log_group.value' "$OUTPUTS_FILE")
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    
    # Create ECS task definitions and services
    services=("api-gateway" "user-service" "vehicle-service" "booking-service" "notification-service")
    
    for service in "${services[@]}"; do
        print_status "Deploying ECS service: $service"
        
        # Determine CPU and memory based on service
        if [ "$service" = "api-gateway" ]; then
            CPU=512
            MEMORY=1024
            PORT=8080
        else
            CPU=256
            MEMORY=512
            PORT=8080
        fi
        
        # Create task definition
        cat > "/tmp/${service}-task-definition.json" << EOF
{
    "family": "${PROJECT_NAME}-${ENVIRONMENT}-${service}",
    "networkMode": "awsvpc",
    "requiresCompatibilities": ["FARGATE"],
    "cpu": "${CPU}",
    "memory": "${MEMORY}",
    "executionRoleArn": "${EXECUTION_ROLE_ARN}",
    "taskRoleArn": "${TASK_ROLE_ARN}",
    "containerDefinitions": [
        {
            "name": "${service}",
            "image": "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${PROJECT_NAME}-${ENVIRONMENT}/${service}:latest",
            "portMappings": [
                {
                    "containerPort": ${PORT},
                    "protocol": "tcp"
                }
            ],
            "environment": [
                {"name": "PORT", "value": "${PORT}"},
                {"name": "ENV", "value": "production"},
                {"name": "DB_HOST", "value": "${RDS_ENDPOINT%:*}"},
                {"name": "DB_PORT", "value": "5432"},
                {"name": "REDIS_HOST", "value": "${REDIS_ENDPOINT}"},
                {"name": "REDIS_PORT", "value": "6379"},
                {"name": "LOG_LEVEL", "value": "info"}
            ],
            "secrets": [
                {"name": "DB_PASSWORD", "valueFrom": "arn:aws:secretsmanager:${AWS_REGION}:${AWS_ACCOUNT_ID}:secret:${PROJECT_NAME}/${ENVIRONMENT}/db-password"},
                {"name": "REDIS_PASSWORD", "valueFrom": "arn:aws:secretsmanager:${AWS_REGION}:${AWS_ACCOUNT_ID}:secret:${PROJECT_NAME}/${ENVIRONMENT}/redis-password"},
                {"name": "JWT_SECRET", "valueFrom": "arn:aws:secretsmanager:${AWS_REGION}:${AWS_ACCOUNT_ID}:secret:${PROJECT_NAME}/${ENVIRONMENT}/jwt-secret"}
            ],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": "${LOG_GROUP}",
                    "awslogs-region": "${AWS_REGION}",
                    "awslogs-stream-prefix": "${service}"
                }
            },
            "healthCheck": {
                "command": ["CMD-SHELL", "curl -f http://localhost:${PORT}/health || exit 1"],
                "interval": 30,
                "timeout": 10,
                "retries": 3,
                "startPeriod": 60
            }
        }
    ]
}
EOF
        
        # Register task definition
        aws ecs register-task-definition \
            --cli-input-json "file:///tmp/${service}-task-definition.json" \
            --region "$AWS_REGION"
        
        # Create or update service
        if [ "$service" = "api-gateway" ]; then
            # API Gateway needs load balancer configuration
            cat > "/tmp/${service}-service.json" << EOF
{
    "serviceName": "${PROJECT_NAME}-${ENVIRONMENT}-${service}",
    "cluster": "${ECS_CLUSTER}",
    "taskDefinition": "${PROJECT_NAME}-${ENVIRONMENT}-${service}",
    "desiredCount": 2,
    "launchType": "FARGATE",
    "networkConfiguration": {
        "awsvpcConfiguration": {
            "subnets": ["${SUBNET_IDS//,/\",\"}"],
            "securityGroups": ["${SECURITY_GROUP}"],
            "assignPublicIp": "DISABLED"
        }
    },
    "loadBalancers": [
        {
            "targetGroupArn": "${TARGET_GROUP_ARN}",
            "containerName": "${service}",
            "containerPort": ${PORT}
        }
    ],
    "healthCheckGracePeriodSeconds": 300,
    "enableExecuteCommand": true
}
EOF
        else
            # Other services don't need load balancer
            cat > "/tmp/${service}-service.json" << EOF
{
    "serviceName": "${PROJECT_NAME}-${ENVIRONMENT}-${service}",
    "cluster": "${ECS_CLUSTER}",
    "taskDefinition": "${PROJECT_NAME}-${ENVIRONMENT}-${service}",
    "desiredCount": 1,
    "launchType": "FARGATE",
    "networkConfiguration": {
        "awsvpcConfiguration": {
            "subnets": ["${SUBNET_IDS//,/\",\"}"],
            "securityGroups": ["${SECURITY_GROUP}"],
            "assignPublicIp": "DISABLED"
        }
    },
    "enableExecuteCommand": true
}
EOF
        fi
        
        # Check if service exists
        if aws ecs describe-services --cluster "$ECS_CLUSTER" --services "${PROJECT_NAME}-${ENVIRONMENT}-${service}" --region "$AWS_REGION" &> /dev/null; then
            # Update existing service
            aws ecs update-service \
                --cluster "$ECS_CLUSTER" \
                --service "${PROJECT_NAME}-${ENVIRONMENT}-${service}" \
                --task-definition "${PROJECT_NAME}-${ENVIRONMENT}-${service}" \
                --region "$AWS_REGION"
        else
            # Create new service
            aws ecs create-service \
                --cli-input-json "file:///tmp/${service}-service.json" \
                --region "$AWS_REGION"
        fi
        
        print_status "ECS service $service deployed"
        
        # Clean up temp files
        rm "/tmp/${service}-task-definition.json" "/tmp/${service}-service.json"
    done
}

# Function to check deployment status
check_deployment_status() {
    print_step "Checking deployment status"
    
    OUTPUTS_FILE="$TERRAFORM_DIR/terraform-outputs.json"
    ECS_CLUSTER=$(jq -r '.ecs_cluster_name.value' "$OUTPUTS_FILE")
    LOAD_BALANCER_DNS=$(jq -r '.load_balancer_dns.value' "$OUTPUTS_FILE")
    
    services=("api-gateway" "user-service" "vehicle-service" "booking-service" "notification-service")
    
    for service in "${services[@]}"; do
        echo -n "Checking $service"
        
        for i in {1..30}; do
            RUNNING_COUNT=$(aws ecs describe-services \
                --cluster "$ECS_CLUSTER" \
                --services "${PROJECT_NAME}-${ENVIRONMENT}-${service}" \
                --region "$AWS_REGION" \
                --query 'services[0].runningCount' \
                --output text)
            
            if [ "$RUNNING_COUNT" -gt 0 ]; then
                print_status "$service is running"
                break
            fi
            
            echo -n "."
            sleep 10
        done
        
        if [ "$RUNNING_COUNT" -eq 0 ]; then
            print_warning "$service is not running yet"
        fi
    done
    
    print_status "Load Balancer DNS: $LOAD_BALANCER_DNS"
    print_status "You can access the application at: http://$LOAD_BALANCER_DNS"
}

# Main deployment function
main() {
    echo "🚀 Car Rental Platform - AWS Deployment"
    echo "========================================"
    echo "Project: $PROJECT_NAME"
    echo "Environment: $ENVIRONMENT"
    echo "Region: $AWS_REGION"
    echo ""
    
    # Check prerequisites
    check_aws_cli
    check_terraform
    check_docker
    
    # Check if terraform.tfvars exists
    if [ ! -f "$TERRAFORM_DIR/terraform.tfvars" ]; then
        print_error "terraform.tfvars not found in $TERRAFORM_DIR"
        print_status "Please copy terraform.tfvars.example to terraform.tfvars and customize the values"
        exit 1
    fi
    
    case "${1:-all}" in
        "infrastructure")
            deploy_infrastructure
            ;;
        "images")
            build_and_push_images
            ;;
        "services")
            deploy_ecs_services
            ;;
        "status")
            check_deployment_status
            ;;
        "all")
            deploy_infrastructure
            build_and_push_images
            deploy_ecs_services
            check_deployment_status
            ;;
        *)
            echo "Usage: $0 {infrastructure|images|services|status|all}"
            echo ""
            echo "Commands:"
            echo "  infrastructure - Deploy AWS infrastructure with Terraform"
            echo "  images        - Build and push Docker images to ECR"
            echo "  services      - Deploy ECS services"
            echo "  status        - Check deployment status"
            echo "  all           - Run all deployment steps"
            exit 1
            ;;
    esac
    
    print_status "AWS deployment completed successfully! 🎉"
}

main "$@"
