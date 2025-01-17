#!/usr/bin/env zx
import Configstore from "configstore";
import clear from "clear";
import {
  createManagedSSHSessionCommand,
  getBastionSessionCommand,
  listBastionSessions,
} from "./lib/oci/bastion.mjs";
import { getOutputValues } from "./lib/terraform.mjs";
import { chalk } from "zx";

$.verbose = false;

clear();
console.log("Creating Bastion Session...");

const projectName = "selai";

const config = new Configstore(projectName, { projectName });

const regionName = config.get("regionName");
const profile = config.get("profile");
const publicKeyPath = config.get("publicKeyPath");
const privateKeyPath = config.get("privateKeyPath");

const {
  ops_instance_id: instanceId,
  app_bastion_id: appBastionId,
  ops_instance_name: instanceName,
} = await getOutputValues(path.join("deploy", "tf", "app"));
const existingInstanceSessions = await listBastionSessions(
  {
    regionName,
    profile,
  },
  appBastionId
);
const sessionComputeList = existingInstanceSessions.filter((s) => {
  const targetResourceDetails = s["target-resource-details"];
  const targetResourceId = targetResourceDetails["target-resource-id"];
  return targetResourceId.includes("instance");
});

if (sessionComputeList.length) {
  // get session command
  const command = await getBastionSessionCommand(
    { regionName, profile },
    sessionComputeList[0].id // FIXME pick the session for the compute
  );
  const fullCommand = command.replaceAll("<privateKey>", privateKeyPath);
  console.log(chalk.yellow(fullCommand));
} else {
  const command = await createManagedSSHSessionCommand(
    {
      regionName,
      profile,
    },
    appBastionId,
    instanceName,
    instanceId,
    publicKeyPath,
    "opc"
  );
  const fullCommand = command.replaceAll("<privateKey>", privateKeyPath);
  console.log(chalk.yellow(fullCommand));
}
