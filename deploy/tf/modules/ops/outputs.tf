output "private_ip" {
  value = oci_core_instance.instance.private_ip
}

output "id" {
  value = oci_core_instance.instance.id
}

output "name" {
  value = oci_core_instance.instance.display_name
}

output "bastion_id" {
  value = oci_bastion_bastion.app_subnet_bastion.id
}