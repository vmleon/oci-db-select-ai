# OCI DB Select AI

> This content is a Work In Progress

This project show you how to work with Oracle Database Select AI. You can use a single database to host your schema and create metadata for Select AI or, like in this project, have 2 databases one with the schema for your production data and a second database for Select AI and any Database AI capability.

You will have a fully functional deployment to battle-test your knowledge with hands-on experience, and make adjustments on the code to fit your needs.

Happy hacking!

## Requirements

- Node.js (LTS version preferred, tested on v22.13)
- Java JDK (23 preferred, tested on 23.0.1; 17+ will work with minor changes)
- OCI CLI (installed and configured)
- Oracle Cloud account (region that support OCI Gen AI)
- Admin permissions on OCI

## Clone the repository

```bash
git clone https://github.com/vmleon/oci-db-select-ai.git
```

Go to the newly cloned folder `oci-db-select-ai`.

```bash
cd oci-db-select-ai
```

## Setup environment

Install the dependencies for the scripts in [Google ZX](https://google.github.io/zx/).

```bash
cd scripts/ && npm install && cd ..
```

## Build components

Build Backend

```bash
cd src/backend
```

```bash
./gradlew clean bootJar
```

```bash
cd ../..
```

## Setup environment

Answer all the questions from `setenv.mjs` script:

```bash
zx scripts/setenv.mjs
```

## Deploy with Terraform

Generate the `terraform.tfvars` file:

```bash
zx scripts/tfvars.mjs
```

Run the commands that `tfvars.mjs` output in yellow one by one.

Come back to the root folder:

```bash
cd ../../..
```

## SSH into the machines

Create the bastion host session

```bash
zx scripts/bastion-session.mjs
```

Paste the yellow command to connect with SSH into the compute instance.

To connect, answer `yes` to add the fingerprint to the know hosts.

When in the `ops` machine, you can also connect to the `backend` machine with this command

```bash
ssh -i /home/opc/private.key opc@$(jq -r .backend_private_ip ansible_params.json)
```

## Clean up

Go to the folder `deploy/tf/app`.

```bash
cd deploy/tf/app
```

Run the Terraform destroy:

```bash
terraform destroy -auto-approve
```

Come back to the root compartment:

```bash
cd ../../..
```

Clean all auxiliary files:

```bash
zx scripts/clean.mjs
```
