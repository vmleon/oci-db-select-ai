#!/usr/bin/env zx
import Configstore from "configstore";
import clear from "clear";

$.verbose = false;

clear();
console.log("Clean up config files, certs, ssh keys...");

const projectName = "selai";

const config = new Configstore(projectName, { projectName });

const filesToDelete = [
  "./.certs",
  "deploy/tf/modules/ops/generated",
  "deploy/tf/modules/adbs/generated",
  "deploy/tf/app/generated",
  "deploy/tf/app/terraform.tfvars",
  "deploy/tf/app/generated",
];
filesToDelete.forEach(async (filePath) => {
  await $`rm -rf ${filePath}`;
  console.log(`${chalk.green(filePath)} deleted`);
});

const sshPathParam = path.join(os.homedir(), ".ssh", projectName);
await $`rm -f ${sshPathParam}*`;
console.log(`${chalk.green("SSH keys")} deleted`);

config.clear();
console.log(`${chalk.green("Config file")} deleted`);
