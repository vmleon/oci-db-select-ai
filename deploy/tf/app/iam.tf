locals {
  group_name = "genai_group_${local.project_name}${local.deploy_id}"
  dynamic_group_name = "genai_dynamic_group_${local.project_name}${local.deploy_id}"
}

resource "oci_identity_dynamic_group" "autonomous_dynamic_group" {
  provider = oci.home

  name           = local.dynamic_group_name
  description    = "${local.dynamic_group_name} Autonomous Dynamic Group"
  compartment_id = var.tenancy_ocid
  matching_rule  = "ALL {resource.type = 'autonomousdatabase', resource.compartment.id = '${var.compartment_ocid}'}"
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
  description    = "Allow group to call ${local.group_name} service at compartment level for ${local.project_name} ${local.deploy_id}"
  statements = [
    "Allow group ${local.group_name} to  manage generative-ai-family in compartment id ${var.compartment_ocid}"
  ]

  depends_on = [ oci_identity_group.genai_group ]
}

resource "oci_identity_policy" "dg_allow_genai_in_compartment_policy" {
  provider       = oci.home
  compartment_id = var.tenancy_ocid
  name           = "dg_${local.project_name}${local.deploy_id}"
  description    = "Allow dynamic group ${local.dynamic_group_name} to call service at compartment level for ${local.project_name} ${local.deploy_id}"
  statements = [
    "Allow dynamic-group ${local.dynamic_group_name} to manage generative-ai-family in compartment id ${var.compartment_ocid}"
  ]

  depends_on = [ oci_identity_dynamic_group.autonomous_dynamic_group ]
}

resource "oci_identity_policy" "dg_allow_more_genai_in_compartment_policy" {
  provider       = oci.home
  compartment_id = var.tenancy_ocid
  name           = "dg_any_user_${local.project_name}${local.deploy_id}"
  description    = "Allow any-user to call ${local.dynamic_group_name} service at compartment level for ${local.project_name} ${local.deploy_id}"
  statements = [
    "Allow any-user to manage generative-ai-family in compartment id ${var.compartment_ocid} where any {request.principal.type='autonomous-databases-family', request.principal.id='${module.adbs.id}'}"
  ]

  depends_on = [ oci_identity_dynamic_group.autonomous_dynamic_group, module.adbs ]
}

resource "oci_identity_api_key" "api_key" {
    provider       = oci.home
    key_value = file(pathexpand(var.public_api_key_path))
    user_id = oci_identity_user.genai_user.id
}