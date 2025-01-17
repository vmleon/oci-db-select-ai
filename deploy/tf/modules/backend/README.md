# Compute Module

Usage:

```tf
module "compute" {
  source = "./modules/compute"

  project_name= ""

  deploy_id= ""

  tenancy_ocid= ""

  compartment_ocid= ""

  subnet_id= ""

  db_password= ""

  instance_shape= ""

  ssh_private_key_path= ""

  ssh_public_key= ""
}
```
