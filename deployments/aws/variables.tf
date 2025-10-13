# Variables for AWS deployment

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "carrental"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "prod"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-west-2"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private subnets"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.20.0/24"]
}

variable "enable_deletion_protection" {
  description = "Enable deletion protection for resources"
  type        = bool
  default     = true
}

# RDS Variables
variable "postgres_version" {
  description = "PostgreSQL version"
  type        = string
  default     = "15.4"
}

variable "postgres_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "postgres_allocated_storage" {
  description = "Initial allocated storage in GB"
  type        = number
  default     = 20
}

variable "postgres_max_allocated_storage" {
  description = "Maximum allocated storage in GB"
  type        = number
  default     = 100
}

variable "postgres_db_name" {
  description = "Database name"
  type        = string
  default     = "carrental"
}

variable "postgres_username" {
  description = "Database username"
  type        = string
  default     = "postgres"
}

variable "postgres_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}

variable "backup_retention_period" {
  description = "Database backup retention period in days"
  type        = number
  default     = 7
}

variable "backup_window" {
  description = "Database backup window"
  type        = string
  default     = "03:00-04:00"
}

variable "maintenance_window" {
  description = "Database maintenance window"
  type        = string
  default     = "sun:04:00-sun:05:00"
}

# Redis Variables
variable "redis_node_type" {
  description = "ElastiCache node type"
  type        = string
  default     = "cache.t3.micro"
}

variable "redis_num_cache_nodes" {
  description = "Number of cache nodes"
  type        = number
  default     = 1
}

variable "redis_auth_token" {
  description = "Redis authentication token"
  type        = string
  sensitive   = true
}

# ECS Variables
variable "api_gateway_cpu" {
  description = "CPU units for API Gateway"
  type        = number
  default     = 512
}

variable "api_gateway_memory" {
  description = "Memory for API Gateway in MB"
  type        = number
  default     = 1024
}

variable "service_cpu" {
  description = "CPU units for microservices"
  type        = number
  default     = 256
}

variable "service_memory" {
  description = "Memory for microservices in MB"
  type        = number
  default     = 512
}

variable "desired_capacity" {
  description = "Desired number of tasks"
  type        = number
  default     = 2
}

variable "max_capacity" {
  description = "Maximum number of tasks"
  type        = number
  default     = 10
}

variable "min_capacity" {
  description = "Minimum number of tasks"
  type        = number
  default     = 1
}

# Application Variables
variable "jwt_secret" {
  description = "JWT secret key"
  type        = string
  sensitive   = true
}

variable "cors_origins" {
  description = "CORS allowed origins"
  type        = string
  default     = "https://yourdomain.com"
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 30
}

variable "domain_name" {
  description = "Domain name for the application"
  type        = string
  default     = ""
}

variable "certificate_arn" {
  description = "ACM certificate ARN for SSL"
  type        = string
  default     = ""
}

# Email Configuration
variable "email_smtp_host" {
  description = "SMTP host for email notifications"
  type        = string
  default     = "smtp.gmail.com"
}

variable "email_smtp_port" {
  description = "SMTP port for email notifications"
  type        = string
  default     = "587"
}

variable "email_username" {
  description = "Email username"
  type        = string
  sensitive   = true
  default     = ""
}

variable "email_password" {
  description = "Email password"
  type        = string
  sensitive   = true
  default     = ""
}

variable "email_from" {
  description = "From email address"
  type        = string
  default     = "noreply@yourdomain.com"
}
