variable "project_name" {
  type = string
}

variable "deploy_id" {
  type = string
}

variable "tenancy_ocid" {
  type = string
}

variable "region" {
  type = string
}

variable "config_file_profile" {
  type = string
}

variable "compartment_ocid" {
  type = string
}

variable "subnet_id" {
  type = string
}

variable "user_ocid" {
  type = string
}

variable "fingerprint" {
  type = string
}

variable "private_api_key_content" {
  type = string
  sensitive = true
}

variable "ads" {
  type = list(any)
}

variable "db_admin_password" {
  type      = string
  sensitive = true
}

variable "db_wallet_par_full_path" {
  type      = string
}

variable "backend_private_ip" {
  type      = string
}

variable "web_private_ip" {
  type      = string
}

variable "instance_shape" {
  type = string
}

variable "ssh_private_key_path" {
  type = string
}

variable "ssh_public_key" {
  type = string
}

variable "ansible_ops_artifact_par_full_path" {
  type = string
}

variable "oci_genai_runtime_name" {
  type = string
}

variable "oci_genai_model_name" {
  type = string
}

variable "oci_genai_compartment_id" {
  type = string
}
