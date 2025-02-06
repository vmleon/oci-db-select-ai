
resource "random_string" "deploy_id" {
  length  = 2
  special = false
  upper   = false
}

module "adbs" {
  source = "../modules/adbs"

  project_name           = local.project_name
  deploy_id              = local.deploy_id
  compartment_ocid       = var.compartment_ocid
}

module "backend" {
  source = "../modules/backend"

  project_name        = local.project_name
  deploy_id           = local.deploy_id
  config_file_profile = var.config_file_profile
  region              = var.region
  tenancy_ocid        = var.tenancy_ocid
  compartment_ocid    = var.compartment_ocid

  subnet_id      = oci_core_subnet.app_subnet.id
  instance_shape = var.instance_shape
  ssh_public_key = var.ssh_public_key
  ads            = data.oci_identity_availability_domains.ads.availability_domains
  
  db_admin_password = module.adbs.admin_password

  ansible_backend_artifact_par_full_path = oci_objectstorage_preauthrequest.ansible_backend_artifact_par.full_path
  backend_jar_par_full_path              = oci_objectstorage_preauthrequest.backend_jar_artifact_par.full_path 
  wallet_par_full_path                   = oci_objectstorage_preauthrequest.db_wallet_artifact_par.full_path
}

module "web" {
  source = "../modules/web"

  project_name        = local.project_name
  deploy_id           = local.deploy_id
  config_file_profile = var.config_file_profile
  region              = var.region
  tenancy_ocid        = var.tenancy_ocid
  compartment_ocid    = var.compartment_ocid

  subnet_id      = oci_core_subnet.app_subnet.id
  instance_shape = var.instance_shape
  ssh_public_key = var.ssh_public_key
  ads            = data.oci_identity_availability_domains.ads.availability_domains

  ansible_web_artifact_par_full_path   = oci_objectstorage_preauthrequest.ansible_web_artifact_par.full_path
  web_artifact_par_full_path           = oci_objectstorage_preauthrequest.web_artifact_par.full_path
}

module "ops" {
  source = "../modules/ops"

  project_name        = local.project_name
  deploy_id           = local.deploy_id
  config_file_profile = var.config_file_profile
  region              = var.region
  tenancy_ocid        = var.tenancy_ocid
  compartment_ocid    = var.compartment_ocid

  user_ocid                = oci_identity_user.genai_user.id
  private_api_key_content  = var.private_api_key_content
  fingerprint              = oci_identity_api_key.api_key.fingerprint

  oci_genai_runtime_name = "LLAMA" // COHERE
  oci_genai_model_name = "cohere.command-r-08-2024" // Not used
  oci_genai_compartment_id = var.compartment_ocid

  subnet_id            = oci_core_subnet.app_subnet.id
  instance_shape       = var.instance_shape
  backend_private_ip   = module.backend.private_ip
  web_private_ip       = module.web.private_ip
  ssh_private_key_path = var.ssh_private_key_path
  ssh_public_key       = var.ssh_public_key
  ads                  = data.oci_identity_availability_domains.ads.availability_domains

  db_admin_password      = module.adbs.admin_password
  db_wallet_par_full_path = oci_objectstorage_preauthrequest.db_wallet_artifact_par.full_path

  # hotels_dataset_par  = oci_objectstorage_preauthrequest.hotels_dataset_par.full_path

  ansible_ops_artifact_par_full_path = oci_objectstorage_preauthrequest.ansible_ops_artifact_par.full_path

}


resource "local_file" "adb_wallet_file" {
  content_base64 = module.adbs.wallet_zip_base64
  filename       = "${path.module}/generated/wallet.zip"
}