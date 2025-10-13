# Variables for GCP deployment

variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

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

variable "region" {
  description = "GCP region"
  type        = string
  default     = "us-west1"
}

variable "zone" {
  description = "GCP zone"
  type        = string
  default     = "us-west1-a"
}

variable "alternative_zone" {
  description = "Alternative GCP zone for high availability"
  type        = string
  default     = "us-west1-b"
}

# Network Configuration
variable "public_subnet_cidr" {
  description = "CIDR block for public subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "private_subnet_cidr" {
  description = "CIDR block for private subnet"
  type        = string
  default     = "10.0.2.0/24"
}

variable "gke_pods_cidr" {
  description = "CIDR block for GKE pods"
  type        = string
  default     = "10.1.0.0/16"
}

variable "gke_services_cidr" {
  description = "CIDR block for GKE services"
  type        = string
  default     = "10.2.0.0/16"
}

variable "enable_deletion_protection" {
  description = "Enable deletion protection for resources"
  type        = bool
  default     = true
}

# GKE Configuration
variable "node_count" {
  description = "Number of nodes in the GKE cluster"
  type        = number
  default     = 2
}

variable "min_node_count" {
  description = "Minimum number of nodes in the GKE cluster"
  type        = number
  default     = 1
}

variable "max_node_count" {
  description = "Maximum number of nodes in the GKE cluster"
  type        = number
  default     = 10
}

variable "node_machine_type" {
  description = "Machine type for GKE nodes"
  type        = string
  default     = "e2-standard-2"
}

variable "node_disk_size" {
  description = "Disk size for GKE nodes in GB"
  type        = number
  default     = 50
}

variable "use_preemptible" {
  description = "Use preemptible instances for cost savings"
  type        = bool
  default     = false
}

# Cloud SQL Configuration
variable "postgres_tier" {
  description = "Cloud SQL instance tier"
  type        = string
  default     = "db-f1-micro"
}

variable "postgres_availability_type" {
  description = "Cloud SQL availability type"
  type        = string
  default     = "ZONAL"
}

variable "postgres_disk_size" {
  description = "Cloud SQL disk size in GB"
  type        = number
  default     = 20
}

variable "postgres_max_disk_size" {
  description = "Cloud SQL maximum disk size in GB"
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

variable "backup_retention_days" {
  description = "Database backup retention period in days"
  type        = number
  default     = 7
}

# Redis Configuration
variable "redis_tier" {
  description = "Redis tier (BASIC or STANDARD_HA)"
  type        = string
  default     = "BASIC"
}

variable "redis_memory_size" {
  description = "Redis memory size in GB"
  type        = number
  default     = 1
}

# Application Configuration
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

variable "domain_name" {
  description = "Domain name for the application"
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
