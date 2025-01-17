#!/usr/bin/env zx
import Mustache from "mustache";
import Configstore from "configstore";
import clear from "clear";
$.verbose = false;

clear();
console.log("Create terraform.tfvars...");

const projectName = "selai";

const config = new Configstore(projectName, { projectName });

await generateTFVars();

async function generateTFVars() {
  const tenancyId = config.get("tenancyId");
  const regionName = config.get("regionName");
  const profile = config.get("profile");
  const compartmentId = config.get("compartmentId");
  const compartmentName = config.get("compartmentName");
  const certFullchain = config.get("certFullchain");
  const certPrivateKey = config.get("certPrivateKey");
  const publicKeyContent = config.get("publicKeyContent");
  const sshPrivateKeyPath = config.get("privateKeyPath");
  const instanceShape = config.get("instanceShape");

  const tfFolder = path.join("deploy", "tf", "app");
  const tfVarsPath = path.join(tfFolder, "terraform.tfvars");

  const tfvarsTemplate = await fs.readFile(`${tfVarsPath}.mustache`, "utf-8");

  const output = Mustache.render(tfvarsTemplate, {
    tenancy_id: tenancyId,
    region_name: regionName,
    compartment_id: compartmentId,
    cert_fullchain: certFullchain,
    cert_private_key: certPrivateKey,
    ssh_public_key: publicKeyContent,
    ssh_private_key_path: sshPrivateKeyPath,
    config_file_profile: profile,
    project_name: projectName,
    instance_shape: instanceShape,
  });

  console.log(
    `Terraform will deploy resources in ${chalk.green(
      regionName
    )} in compartment ${
      compartmentName ? chalk.green(compartmentName) : chalk.green("root")
    }`
  );

  await fs.writeFile(tfVarsPath, output);

  console.log(`File ${chalk.green(tfVarsPath)} created`);

  console.log(`1. ${chalk.yellow("cd " + tfFolder)}`);
  console.log(`2. ${chalk.yellow("terraform init")}`);
  console.log(`3. ${chalk.yellow("terraform apply -auto-approve")}`);
}
