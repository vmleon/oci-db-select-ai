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

variable "ads" {
  type = list(any)
}

variable "instance_shape" {
  type = string
}

variable "ssh_public_key" {
  type = string
}

variable "ansible_backend_artifact_par_full_path" {
  type = string
}


variable "backend_jar_par_full_path" {
  type = string
}


variable "db_admin_password" {
  type      = string
  sensitive = true
}

variable "wallet_par_full_path" {
  type = string
}