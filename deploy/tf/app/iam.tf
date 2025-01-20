locals {
  group_name = "genai_group_${local.project_name}${local.deploy_id}"
}

resource "oci_identity_group" "genai_group" {
  provider       = oci.home
  compartment_id = var.tenancy_ocid
  description    = "Group for ${local.project_name} ${local.deploy_id}"
  name           = local.group_name
}

resource "oci_identity_user" "genai_user" {
  provider       = oci.home
  compartment_id = var.tenancy_ocid
  name           = "${local.project_name}-${local.deploy_id}"
  description    = "User for ${local.project_name} ${local.deploy_id}"
  email          = "${local.project_name}${local.deploy_id}@example.com"
}

resource "oci_identity_policy" "allow_genai_in_compartment_policy" {
  provider       = oci.home
  compartment_id = var.tenancy_ocid
  name           = "${local.project_name}${local.deploy_id}"
  description    = "Allow group to call GenAI service at compartment level for ${local.project_name} ${local.deploy_id}"
  statements = [
    "Allow group ${local.group_name} to  manage generative-ai-family in compartment id ${var.compartment_ocid}"
  ]
}

resource "oci_identity_api_key" "api_key" {
    provider       = oci.home
    key_value = file(pathexpand(var.public_api_key_path))
    user_id = oci_identity_user.genai_user.id
}