# OCI DB Select AI

> This content is a Work In Progress

This project show you how to work with Oracle Database Select AI. You can use a single database to host your schema and create metadata for Select AI or, like in this project, have 2 databases one with the schema for your production data and a second database for Select AI and any Database AI capability.

You will have a fully functional deployment to battle-test your knowledge with hands-on experience, and make adjustments on the code to fit your needs.

Happy hacking!

## Documentation

- [Select AI Use Cases](https://docs.public.content.oci.oraclecloud.com/en-us/iaas/autonomous-database-serverless/doc/select-ai-use-cases.html)
- [Use Select AI for Natural Language Interaction with your Database](https://docs.oracle.com/en/cloud/paas/autonomous-database/serverless/adbsb/sql-generation-ai-autonomous.html)
- [Examples of Using Select AI](https://docs.oracle.com/en-us/iaas/autonomous-database-serverless/doc/select-ai-examples.html)
- [DBMS_CLOUD_AI Package](https://docs.oracle.com/en-us/iaas/autonomous-database-serverless/doc/dbms-cloud-ai-package.html)
- [DBMS_CLOUD_AI Package - Profile Attributes](https://docs.oracle.com/en/cloud/paas/autonomous-database/serverless/adbsb/dbms-cloud-ai-package.html#GUID-12D91681-B51C-48E0-93FD-9ABC67B0F375)
- [Getting Access to Generative AI](https://docs.oracle.com/en-us/iaas/Content/generative-ai/iam-policies.htm)

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

> Connecting to the Backend machine:
>
> When in the `ops` machine, you can also connect to the `backend` machine with this command
>
> ```bash
> ssh -i /home/opc/private.key opc@$(jq -r .backend_private_ip ansible_params.json)
> ```

## Run Select AI queries

Run a normal query against the `SH` schema containing Sales information.

```bash
sql -name admin -s @/home/opc/queries/sh_query.sql
```

Run a natural query language to count the number of customers, the result will be SQL code that can be executed.

```bash
sql -name admin -s @/home/opc/queries/nql_count_customers.sql
```

> Execute the result as admin:
>
> ```bash
> sql -name admin
> ```
>
> From SQLcl console, run the query you got above. For example:
>
> ```sql
> SELECT count(*) FROM SH.CUSTOMERS;
> ```
>
> To exit, type:
>
> ```sql
> exit;
> ```
>
> Run another natural query language to list the customers that buying shoes, the result will be SQL code that can be executed.

```bash
sql -name admin -s @/home/opc/queries/nql_customers_buying_shoes.sql
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
