# Car Rental Platform - Deployment Ecosystem

This document provides a comprehensive guide for deploying the Car Rental Platform across different environments: Local Development, VM/Cloud Hosting, AWS, and Google Cloud Platform.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [VM/Cloud Hosting Deployment](#vmcloud-hosting-deployment)
4. [AWS Deployment](#aws-deployment)
5. [Google Cloud Platform Deployment](#gcp-deployment)
6. [Environment Configurations](#environment-configurations)
7. [Monitoring and Maintenance](#monitoring-and-maintenance)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Docker & Docker Compose**: Container orchestration
- **Git**: Version control
- **Node.js 18+**: Frontend development
- **Go 1.21+**: Backend services
- **Terraform**: Infrastructure as Code (for cloud deployments)

### Cloud-Specific Requirements

**AWS:**
- AWS CLI configured with credentials
- Terraform
- Docker

**GCP:**
- gcloud CLI configured with credentials
- kubectl
- Terraform
- Docker

## Local Development Setup

### Quick Start

```bash
# Clone and setup the development environment
git clone <repository-url>
cd car-rental-platform

# Run the setup script
./setup-local-dev.sh

# Start development environment
./scripts/dev.sh start

# Start admin frontend
./scripts/dev.sh frontend
```

### Manual Setup

1. **Environment Configuration**
```bash
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

2. **Start Services**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

3. **Start Frontend**
```bash
cd admin-frontend
npm run dev
```

### Development URLs

- **API Gateway**: http://localhost:8080
- **Admin Frontend**: http://localhost:5173
- **Database Admin**: http://localhost:8090 (Adminer)
- **Redis Commander**: http://localhost:8091

### Development Commands

```bash
# View logs
./scripts/dev.sh logs [service-name]

# Restart services
./scripts/dev.sh restart

# Clean environment
./scripts/dev.sh clean

# Check status
./scripts/dev.sh status
```

## VM/Cloud Hosting Deployment

Perfect for VPS, dedicated servers, or cloud VMs (DigitalOcean, Linode, etc.).

### Deployment Steps

1. **Prepare Server**
```bash
# On your VM (Ubuntu/Debian)
wget https://raw.githubusercontent.com/your-repo/deployments/vm/deploy-vm.sh
chmod +x deploy-vm.sh
./deploy-vm.sh yourdomain.com
```

2. **Deploy Application**
```bash
# Copy application files to server
scp -r . user@your-server:/opt/carrental/

# Configure environment
cp .env.prod.example .env.prod
# Edit .env.prod with production values

# Start services
sudo systemctl start carrental
```

### VM Architecture

```
Internet → Nginx (80/443) → API Gateway (8080) → Microservices (8081-8084)
                           ↓
                     PostgreSQL (5432) + Redis (6379)
```

### Production Features

- **SSL/TLS**: Automatic Let's Encrypt certificates
- **Load Balancing**: Nginx reverse proxy
- **Security**: UFW firewall, Fail2Ban protection
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Backups**: Automated daily backups
- **Log Rotation**: Automatic log management

## AWS Deployment

Enterprise-grade deployment using AWS managed services.

### Architecture Overview

```
Internet → ALB → ECS Fargate → Microservices
          ↓
    RDS PostgreSQL + ElastiCache Redis
```

### Prerequisites

1. **AWS CLI Setup**
```bash
aws configure
# Enter your AWS Access Key, Secret Key, Region, and Output format
```

2. **Terraform Configuration**
```bash
cd deployments/aws
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your AWS-specific values
```

### Deployment Steps

1. **Infrastructure Deployment**
```bash
cd deployments/aws
./deploy-aws.sh infrastructure
```

2. **Build and Push Images**
```bash
./deploy-aws.sh images
```

3. **Deploy Services**
```bash
./deploy-aws.sh services
```

4. **Full Deployment**
```bash
./deploy-aws.sh all
```

### AWS Resources Created

- **VPC**: Multi-AZ network with public/private subnets
- **ECS Cluster**: Fargate-based container orchestration
- **Application Load Balancer**: Traffic distribution
- **RDS PostgreSQL**: Managed database with automated backups
- **ElastiCache Redis**: Managed in-memory store
- **ECR**: Private Docker registry
- **CloudWatch**: Logging and monitoring
- **Secrets Manager**: Secure credential storage
- **S3**: Application assets storage

### Cost Optimization

- Use `t3.micro` instances for development
- Enable automated scaling
- Use reserved instances for production
- Configure lifecycle policies for logs and backups

### Monitoring

- **CloudWatch Dashboards**: Custom application metrics
- **CloudWatch Alarms**: Automated alerting
- **AWS X-Ray**: Distributed tracing
- **VPC Flow Logs**: Network monitoring

## Google Cloud Platform Deployment

Modern, scalable deployment using GCP managed services.

### Architecture Overview

```
Internet → Load Balancer → GKE Cluster → Microservices Pods
                         ↓
              Cloud SQL PostgreSQL + Memorystore Redis
```

### Prerequisites

1. **GCP Setup**
```bash
# Install gcloud CLI
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Authenticate and set project
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

2. **Terraform Configuration**
```bash
cd deployments/gcp
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your GCP-specific values
```

### Deployment Steps

1. **Enable APIs**
```bash
cd deployments/gcp
./deploy-gcp.sh apis
```

2. **Infrastructure Deployment**
```bash
./deploy-gcp.sh infrastructure
```

3. **Build and Push Images**
```bash
./deploy-gcp.sh images
```

4. **Deploy to GKE**
```bash
./deploy-gcp.sh k8s-setup
./deploy-gcp.sh deploy
```

5. **Full Deployment**
```bash
PROJECT_ID=your-project-id ./deploy-gcp.sh all
```

### GCP Resources Created

- **VPC**: Custom network with regional subnets
- **GKE Cluster**: Managed Kubernetes with auto-scaling
- **Cloud SQL**: Managed PostgreSQL with high availability
- **Memorystore**: Managed Redis cluster
- **Cloud Load Balancing**: Global load balancer
- **Artifact Registry**: Private container registry
- **Cloud Logging**: Centralized logging
- **Cloud Monitoring**: Application monitoring
- **Secret Manager**: Secure credential storage
- **Cloud Storage**: Application assets

### GKE Features

- **Workload Identity**: Secure pod-to-service authentication
- **Horizontal Pod Autoscaling**: Automatic scaling based on metrics
- **Cluster Autoscaling**: Node pool scaling
- **Network Policies**: Pod-to-pod communication control
- **Istio Service Mesh** (optional): Advanced traffic management

## Environment Configurations

### Development (.env.local)
```bash
# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5433
POSTGRES_DB=carrental_dev

# Services
API_GATEWAY_URL=http://localhost:8080
USER_SERVICE_URL=http://localhost:8081

# Security (weak for development)
JWT_SECRET=dev-jwt-secret-key
```

### Production (.env.prod)
```bash
# Database (strong passwords)
POSTGRES_PASSWORD=super-secure-password-32-chars-min
REDIS_PASSWORD=super-secure-redis-password

# Security (strong keys)
JWT_SECRET=super-secure-jwt-secret-64-chars-minimum-for-production

# Email
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_USERNAME=noreply@yourdomain.com
EMAIL_PASSWORD=app-specific-password

# Domain
DOMAIN=yourdomain.com
CORS_ORIGINS=https://yourdomain.com,https://admin.yourdomain.com
```

## Monitoring and Maintenance

### Health Checks

All deployments include health check endpoints:

```bash
# API Gateway
curl http://your-domain/health

# Individual Services
curl http://your-domain/api/v1/users/health
curl http://your-domain/api/v1/vehicles/health
curl http://your-domain/api/v1/bookings/health
curl http://your-domain/api/v1/notifications/health
```

### Log Management

**Local Development:**
```bash
# View specific service logs
docker-compose -f docker-compose.dev.yml logs -f user-service

# View all logs
docker-compose -f docker-compose.dev.yml logs -f
```

**VM Deployment:**
```bash
# Application logs
sudo journalctl -u carrental -f

# Nginx logs
sudo tail -f /var/log/nginx/carrental_access.log
sudo tail -f /var/log/nginx/carrental_error.log
```

**AWS:**
```bash
# View CloudWatch logs
aws logs describe-log-groups
aws logs tail /ecs/carrental-prod --follow
```

**GCP:**
```bash
# View Cloud Logging
gcloud logging read "resource.type=k8s_container" --limit 50
kubectl logs -f deployment/api-gateway -n carrental
```

### Backup Procedures

**VM Deployment:**
- Automated daily database backups at 2:00 AM
- 30-day retention policy
- Optional S3 upload for off-site storage

**AWS:**
- RDS automated backups with point-in-time recovery
- EBS snapshots for persistent volumes
- S3 versioning for application assets

**GCP:**
- Cloud SQL automated backups
- Persistent disk snapshots
- Cloud Storage versioning

### Scaling

**VM Deployment:**
```bash
# Scale with Docker Compose
docker-compose -f docker-compose.prod.yml up -d --scale user-service=3
```

**AWS:**
```bash
# Update ECS service desired count
aws ecs update-service --cluster carrental-prod-cluster --service user-service --desired-count 3
```

**GCP:**
```bash
# Scale Kubernetes deployment
kubectl scale deployment user-service --replicas=3 -n carrental
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
```bash
# Check database connectivity
docker exec -it carrental_postgres psql -U postgres -d carrental_dev

# Test from application
curl http://localhost:8081/health
```

2. **Service Discovery Issues**
```bash
# Check Docker network
docker network inspect carrental-dev-network

# Check service endpoints
docker exec -it carrental_api_gateway nslookup user-service
```

3. **SSL Certificate Issues (VM)**
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew --nginx
```

4. **Memory Issues**
```bash
# Check container resource usage
docker stats

# Increase container limits in docker-compose.yml
```

### Performance Tuning

1. **Database Optimization**
- Enable connection pooling
- Configure appropriate shared_buffers
- Set up read replicas for high-traffic applications

2. **Redis Configuration**
- Configure maxmemory policies
- Enable persistence if needed
- Set up Redis clustering for high availability

3. **Application Tuning**
- Enable HTTP/2 in Nginx
- Configure proper caching headers
- Implement API rate limiting

### Security Hardening

1. **Network Security**
- Configure VPC/firewall rules properly
- Use private subnets for databases
- Enable network encryption

2. **Application Security**
- Rotate JWT secrets regularly
- Use strong, unique passwords
- Enable HTTPS everywhere
- Implement proper CORS policies

3. **Infrastructure Security**
- Keep systems updated
- Use least-privilege access
- Enable audit logging
- Regular security scans

## Migration Between Environments

### Local → VM
1. Export database from local environment
2. Import to production database
3. Update environment variables
4. Deploy application code

### VM → AWS
1. Create RDS database from VM backup
2. Push Docker images to ECR
3. Deploy infrastructure with Terraform
4. Update DNS to point to ALB

### AWS → GCP
1. Export RDS database
2. Import to Cloud SQL
3. Retag and push images to Artifact Registry
4. Deploy to GKE
5. Update DNS to point to GCP Load Balancer

## Support and Documentation

- **Architecture Docs**: `/docs/architecture/`
- **API Documentation**: `/docs/api/`
- **Database Schema**: `/docs/database/`
- **Security Policies**: `/docs/security/`

For issues and questions:
- Check the troubleshooting section
- Review service logs
- Consult cloud provider documentation
- Open a GitHub issue for code-related problems

---

**Last Updated**: October 2025  
**Version**: 1.0.0
