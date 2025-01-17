data "archive_file" "ansible_ops_artifact" {
  type             = "zip"
  source_dir       = "${path.module}/../../ansible/ops"
  output_file_mode = "0666"
  output_path      = "${path.module}/generated/ansible_ops_artifact.zip"
}

data "archive_file" "ansible_backend_artifact" {
  type             = "zip"
  source_dir       = "${path.module}/../../ansible/backend"
  output_file_mode = "0666"
  output_path      = "${path.module}/generated/ansible_backend_artifact.zip"
}

data "archive_file" "backend_jar_artifact" {
  type             = "zip"
  source_file      = "${path.module}/../../../src/backend/build/libs/backend-0.0.1.jar"
  output_file_mode = "0666"
  output_path      = "${path.module}/generated/backend_artifact.zip"
}
