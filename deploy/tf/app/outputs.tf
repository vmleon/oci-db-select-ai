output "deployment" {
  value = "${local.project_name}${local.deploy_id}"
}

output "ops_private_ip" {
  value = module.ops.private_ip
}

output "app_bastion_id" {
  value = module.ops.bastion_id
}

output "db_name" {
  value = module.adbs.db_name
}

output "ops_instance_id" {
  sensitive = true
  value     = module.ops.id
}

output "ops_instance_name" {
  sensitive = false
  value     = module.ops.name
}

output "db_admin_password" {
  value     = module.adbs.admin_password
  sensitive = true
}

output "lb_ip" {
  value = oci_core_public_ip.public_reserved_ip.ip_address
}
