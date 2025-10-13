#!/bin/bash

# GCP Deployment Script for Car Rental Platform
# This script deploys the application to Google Cloud Platform using Terraform and GKE

set -e

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="${PROJECT_ID:-}"
REGION="${REGION:-us-west1}"
PROJECT_NAME="${PROJECT_NAME:-carrental}"
ENVIRONMENT="${ENVIRONMENT:-prod}"
TERRAFORM_DIR="deployments/gcp"

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

# Function to check if gcloud CLI is configured
check_gcloud_cli() {
    if ! command -v gcloud &> /dev/null; then
        print_error "gcloud CLI is not installed. Please install it first."
        echo "Visit: https://cloud.google.com/sdk/docs/install"
        exit 1
    fi
    
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
        print_error "gcloud CLI is not authenticated. Please run 'gcloud auth login' first."
        exit 1
    fi
    
    if [ -z "$PROJECT_ID" ]; then
        PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
        if [ -z "$PROJECT_ID" ]; then
            print_error "GCP Project ID is not set. Please set PROJECT_ID environment variable or run 'gcloud config set project YOUR_PROJECT_ID'"
            exit 1
        fi
    fi
    
    print_status "gcloud CLI is configured with project: $PROJECT_ID"
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

# Function to check if kubectl is installed
check_kubectl() {
    if ! command -v kubectl &> /dev/null; then
        print_warning "kubectl is not installed. Installing it..."
        gcloud components install kubectl
    fi
    
    print_status "kubectl is available"
}

# Function to enable required GCP APIs
enable_gcp_apis() {
    print_step "Enabling required GCP APIs"
    
    apis=(
        "compute.googleapis.com"
        "container.googleapis.com"
        "servicenetworking.googleapis.com"
        "sqladmin.googleapis.com"
        "redis.googleapis.com"
        "secretmanager.googleapis.com"
        "logging.googleapis.com"
        "monitoring.googleapis.com"
        "cloudresourcemanager.googleapis.com"
        "iam.googleapis.com"
        "storage.googleapis.com"
        "artifactregistry.googleapis.com"
    )
    
    for api in "${apis[@]}"; do
        print_status "Enabling $api..."
        gcloud services enable "$api" --project="$PROJECT_ID"
    done
    
    print_status "All required APIs enabled"
}

# Function to build and push Docker images
build_and_push_images() {
    print_step "Building and pushing Docker images to Artifact Registry"
    
    # Configure Docker for Artifact Registry
    gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet
    
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
        
        # Tag for Artifact Registry
        REGISTRY_URI="${REGION}-docker.pkg.dev/${PROJECT_ID}/${PROJECT_NAME}-${ENVIRONMENT}-repo/${service}"
        docker tag "$PROJECT_NAME/$service:latest" "$REGISTRY_URI:latest"
        docker tag "$PROJECT_NAME/$service:latest" "$REGISTRY_URI:$(date +%Y%m%d-%H%M%S)"
        
        # Push to Artifact Registry
        print_status "Pushing $service to Artifact Registry..."
        docker push "$REGISTRY_URI:latest"
        docker push "$REGISTRY_URI:$(date +%Y%m%d-%H%M%S)"
        
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
    terraform plan -var="project_id=$PROJECT_ID" -var-file="terraform.tfvars" -out="tfplan"
    
    # Apply deployment
    print_status "Applying Terraform configuration..."
    terraform apply "tfplan"
    
    # Save outputs
    terraform output -json > terraform-outputs.json
    
    cd - > /dev/null
    
    print_status "Infrastructure deployed successfully"
}

# Function to configure kubectl
configure_kubectl() {
    print_step "Configuring kubectl for GKE cluster"
    
    OUTPUTS_FILE="$TERRAFORM_DIR/terraform-outputs.json"
    
    if [ ! -f "$OUTPUTS_FILE" ]; then
        print_error "Terraform outputs file not found. Please run infrastructure deployment first."
        exit 1
    fi
    
    CLUSTER_NAME=$(jq -r '.gke_cluster_name.value' "$OUTPUTS_FILE")
    
    # Get GKE credentials
    gcloud container clusters get-credentials "$CLUSTER_NAME" --region="$REGION" --project="$PROJECT_ID"
    
    print_status "kubectl configured for GKE cluster: $CLUSTER_NAME"
}

# Function to create Kubernetes manifests
create_k8s_manifests() {
    print_step "Creating Kubernetes manifests"
    
    OUTPUTS_FILE="$TERRAFORM_DIR/terraform-outputs.json"
    
    # Extract values from Terraform outputs
    POSTGRES_HOST=$(jq -r '.postgres_private_ip.value' "$OUTPUTS_FILE")
    REDIS_HOST=$(jq -r '.redis_host.value' "$OUTPUTS_FILE")
    WORKLOAD_SA=$(jq -r '.workload_identity_service_account.value' "$OUTPUTS_FILE")
    REGISTRY_URI="${REGION}-docker.pkg.dev/${PROJECT_ID}/${PROJECT_NAME}-${ENVIRONMENT}-repo"
    
    # Create manifests directory
    mkdir -p k8s-manifests
    
    # Create namespace
    cat > k8s-manifests/namespace.yaml << EOF
apiVersion: v1
kind: Namespace
metadata:
  name: carrental
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: carrental-sa
  namespace: carrental
  annotations:
    iam.gke.io/gcp-service-account: $WORKLOAD_SA
EOF
    
    # Create services manifests
    services=("api-gateway" "user-service" "vehicle-service" "booking-service" "notification-service")
    
    for service in "${services[@]}"; do
        print_status "Creating manifest for $service..."
        
        # Determine service configuration
        if [ "$service" = "api-gateway" ]; then
            REPLICAS=2
            CPU_REQUEST="250m"
            CPU_LIMIT="500m"
            MEMORY_REQUEST="512Mi"
            MEMORY_LIMIT="1Gi"
            SERVICE_TYPE="LoadBalancer"
        else
            REPLICAS=1
            CPU_REQUEST="100m"
            CPU_LIMIT="250m"
            MEMORY_REQUEST="256Mi"
            MEMORY_LIMIT="512Mi"
            SERVICE_TYPE="ClusterIP"
        fi
        
        cat > "k8s-manifests/${service}.yaml" << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${service}
  namespace: carrental
  labels:
    app: ${service}
spec:
  replicas: ${REPLICAS}
  selector:
    matchLabels:
      app: ${service}
  template:
    metadata:
      labels:
        app: ${service}
    spec:
      serviceAccountName: carrental-sa
      containers:
      - name: ${service}
        image: ${REGISTRY_URI}/${service}:latest
        ports:
        - containerPort: 8080
        env:
        - name: PORT
          value: "8080"
        - name: ENV
          value: "production"
        - name: DB_HOST
          value: "${POSTGRES_HOST}"
        - name: DB_PORT
          value: "5432"
        - name: DB_NAME
          value: "carrental"
        - name: DB_USER
          value: "postgres"
        - name: REDIS_HOST
          value: "${REDIS_HOST}"
        - name: REDIS_PORT
          value: "6379"
        - name: LOG_LEVEL
          value: "info"
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: password
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: jwt-secret
              key: secret
        resources:
          requests:
            cpu: ${CPU_REQUEST}
            memory: ${MEMORY_REQUEST}
          limits:
            cpu: ${CPU_LIMIT}
            memory: ${MEMORY_LIMIT}
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: ${service}
  namespace: carrental
spec:
  selector:
    app: ${service}
  ports:
  - port: 8080
    targetPort: 8080
  type: ${SERVICE_TYPE}
EOF
    done
    
    # Create secrets manifest (to be populated manually)
    cat > k8s-manifests/secrets.yaml << EOF
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
  namespace: carrental
type: Opaque
stringData:
  password: "your-database-password"
---
apiVersion: v1
kind: Secret
metadata:
  name: jwt-secret
  namespace: carrental
type: Opaque
stringData:
  secret: "your-jwt-secret"
EOF
    
    print_status "Kubernetes manifests created in k8s-manifests/"
}

# Function to deploy to GKE
deploy_to_gke() {
    print_step "Deploying application to GKE"
    
    # Apply manifests
    kubectl apply -f k8s-manifests/namespace.yaml
    kubectl apply -f k8s-manifests/secrets.yaml
    
    services=("api-gateway" "user-service" "vehicle-service" "booking-service" "notification-service")
    
    for service in "${services[@]}"; do
        print_status "Deploying $service to GKE..."
        kubectl apply -f "k8s-manifests/${service}.yaml"
    done
    
    print_status "Application deployed to GKE"
}

# Function to check deployment status
check_deployment_status() {
    print_step "Checking deployment status"
    
    print_status "Waiting for deployments to be ready..."
    kubectl wait --for=condition=available --timeout=300s deployment --all -n carrental
    
    print_status "Current pod status:"
    kubectl get pods -n carrental
    
    print_status "Service endpoints:"
    kubectl get services -n carrental
    
    # Get load balancer IP
    print_status "Waiting for load balancer IP..."
    LOAD_BALANCER_IP=""
    for i in {1..30}; do
        LOAD_BALANCER_IP=$(kubectl get service api-gateway -n carrental -o jsonpath='{.status.loadBalancer.ingress[0].ip}' 2>/dev/null || echo "")
        if [ -n "$LOAD_BALANCER_IP" ]; then
            break
        fi
        echo -n "."
        sleep 10
    done
    
    if [ -n "$LOAD_BALANCER_IP" ]; then
        print_status "Application is accessible at: http://$LOAD_BALANCER_IP"
    else
        print_warning "Load balancer IP not yet assigned"
    fi
}

# Main deployment function
main() {
    echo "🚀 Car Rental Platform - GCP Deployment"
    echo "========================================"
    echo "Project: $PROJECT_NAME"
    echo "Environment: $ENVIRONMENT"
    echo "Region: $REGION"
    echo ""
    
    # Check prerequisites
    check_gcloud_cli
    check_terraform
    check_docker
    check_kubectl
    
    # Check if terraform.tfvars exists
    if [ ! -f "$TERRAFORM_DIR/terraform.tfvars" ]; then
        print_error "terraform.tfvars not found in $TERRAFORM_DIR"
        print_status "Please copy terraform.tfvars.example to terraform.tfvars and customize the values"
        exit 1
    fi
    
    case "${1:-all}" in
        "apis")
            enable_gcp_apis
            ;;
        "infrastructure")
            deploy_infrastructure
            ;;
        "images")
            build_and_push_images
            ;;
        "k8s-setup")
            configure_kubectl
            create_k8s_manifests
            ;;
        "deploy")
            deploy_to_gke
            ;;
        "status")
            check_deployment_status
            ;;
        "all")
            enable_gcp_apis
            deploy_infrastructure
            build_and_push_images
            configure_kubectl
            create_k8s_manifests
            deploy_to_gke
            check_deployment_status
            ;;
        *)
            echo "Usage: $0 {apis|infrastructure|images|k8s-setup|deploy|status|all}"
            echo ""
            echo "Commands:"
            echo "  apis          - Enable required GCP APIs"
            echo "  infrastructure - Deploy GCP infrastructure with Terraform"
            echo "  images        - Build and push Docker images to Artifact Registry"
            echo "  k8s-setup     - Configure kubectl and create Kubernetes manifests"
            echo "  deploy        - Deploy application to GKE"
            echo "  status        - Check deployment status"
            echo "  all           - Run all deployment steps"
            exit 1
            ;;
    esac
    
    print_status "GCP deployment completed successfully! 🎉"
}

main "$@"
