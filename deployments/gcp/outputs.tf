# Outputs for GCP deployment

output "project_id" {
  description = "GCP Project ID"
  value       = var.project_id
}

output "vpc_network" {
  description = "VPC network name"
  value       = google_compute_network.main.name
}

output "public_subnet" {
  description = "Public subnet name"
  value       = google_compute_subnetwork.public.name
}

output "private_subnet" {
  description = "Private subnet name"
  value       = google_compute_subnetwork.private.name
}

output "gke_cluster_name" {
  description = "GKE cluster name"
  value       = google_container_cluster.main.name
}

output "gke_cluster_endpoint" {
  description = "GKE cluster endpoint"
  value       = google_container_cluster.main.endpoint
  sensitive   = true
}

output "gke_cluster_ca_certificate" {
  description = "GKE cluster CA certificate"
  value       = google_container_cluster.main.master_auth[0].cluster_ca_certificate
  sensitive   = true
}

output "postgres_connection_name" {
  description = "Cloud SQL connection name"
  value       = google_sql_database_instance.postgres.connection_name
}

output "postgres_private_ip" {
  description = "Cloud SQL private IP address"
  value       = google_sql_database_instance.postgres.private_ip_address
  sensitive   = true
}

output "redis_host" {
  description = "Redis instance host"
  value       = google_redis_instance.main.host
  sensitive   = true
}

output "redis_port" {
  description = "Redis instance port"
  value       = google_redis_instance.main.port
}

output "redis_auth_string" {
  description = "Redis authentication string"
  value       = google_redis_instance.main.auth_string
  sensitive   = true
}

output "load_balancer_ip" {
  description = "Load balancer IP address"
  value       = google_compute_global_address.main.address
}

output "artifact_registry_repository" {
  description = "Artifact Registry repository name"
  value       = google_artifact_registry_repository.main.name
}

output "storage_bucket_name" {
  description = "Cloud Storage bucket name"
  value       = google_storage_bucket.app_assets.name
}

output "workload_identity_service_account" {
  description = "Workload Identity service account email"
  value       = google_service_account.workload_identity.email
}

output "secret_manager_secrets" {
  description = "Secret Manager secret names"
  value = {
    db_password = google_secret_manager_secret.db_password.secret_id
    redis_auth  = google_secret_manager_secret.redis_auth.secret_id
    jwt_secret  = google_secret_manager_secret.jwt_secret.secret_id
  }
}

output "dns_configuration" {
  description = "DNS configuration instructions"
  value = var.domain_name != "" ? {
    domain = var.domain_name
    ip     = google_compute_global_address.main.address
    instructions = "Create an A record for ${var.domain_name} pointing to ${google_compute_global_address.main.address}"
  } : {
    ip = google_compute_global_address.main.address
    instructions = "You can access the application at http://${google_compute_global_address.main.address}"
  }
}

output "gcloud_connect_command" {
  description = "Command to connect to GKE cluster"
  value       = "gcloud container clusters get-credentials ${google_container_cluster.main.name} --region ${var.region} --project ${var.project_id}"
}
