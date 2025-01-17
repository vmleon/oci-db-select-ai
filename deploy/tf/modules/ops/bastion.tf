
resource "oci_bastion_bastion" "app_subnet_bastion" {
    bastion_type = "standard"
    compartment_id = var.compartment_ocid
    target_subnet_id = var.subnet_id

    client_cidr_block_allow_list = [local.anywhere]
    name = "app_subnet_${var.project_name}${var.deploy_id}"

    depends_on = [time_sleep.wait_for_instance]

}