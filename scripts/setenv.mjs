#!/usr/bin/env zx
import Configstore from "configstore";
import inquirer from "inquirer";
import clear from "clear";
import { readFile } from "node:fs/promises";
import { parse as iniParse } from "ini";
import {
  getNamespace,
  getRegions,
  searchCompartmentIdByName,
  getEFlexShapes,
} from "./lib/oci.mjs";
import {
  createRSAKeyPair,
  createSelfSignedCert,
  createSSHKeyPair,
} from "./lib/crypto.mjs";

$.verbose = false;

clear();
console.log("Set up environment...");

const projectName = "selai";

const config = new Configstore(projectName, { projectName });

await selectProfile();
const profile = config.get("profile");
const tenancyId = config.get("tenancyId");

await selectRegion();
const regionName = config.get("regionName");

await setNamespaceEnv();

await setCompartmentEnv();
const compartmentId = config.get("compartmentId");

// TODO select ADB size

await selectComputeShape();

await createSSHKeys(projectName);
await createAPIKeys(`${projectName}_api`);
await createCerts();

// TODO download dataset if needed

console.log(`\nConfiguration file saved in: ${chalk.green(config.path)}`);

async function selectProfile() {
  let ociConfigFile = await readFile(`${os.homedir()}/.oci/config`, {
    encoding: "utf-8",
  });

  const ociConfig = iniParse(ociConfigFile);
  const profileList = Object.keys(ociConfig);

  await inquirer
    .prompt([
      {
        type: "list",
        name: "profile",
        message: "Select the OCI Config Profile",
        choices: profileList,
      },
    ])
    .then((answers) => {
      config.set("profile", answers.profile);
      config.set("tenancyId", ociConfig[answers.profile].tenancy);
    });
}

async function selectRegion() {
  const listSubscribedRegions = (await getRegions(profile, tenancyId)).sort(
    (r1, r2) => r1.isHomeRegion > r2.isHomeRegion
  );

  await inquirer
    .prompt([
      {
        type: "list",
        name: "region",
        message: "Select the region",
        choices: listSubscribedRegions.map((r) => r.name),
        filter(val) {
          return listSubscribedRegions.find((r) => r.name === val);
        },
      },
    ])
    .then((answers) => {
      config.set("regionName", answers.region.name);
      config.set("regionKey", answers.region.key);
    });
}

async function setNamespaceEnv() {
  const namespace = await getNamespace(profile);
  config.set("namespace", namespace);
}

async function setCompartmentEnv() {
  await inquirer
    .prompt([
      {
        type: "input",
        name: "compartmentName",
        message: "Compartment Name",
        default() {
          return "root";
        },
      },
    ])
    .then(async (answers) => {
      const compartmentName = answers.compartmentName;
      const compartmentId = await searchCompartmentIdByName(
        { profile, region: regionName },
        compartmentName || "root"
      );
      config.set("compartmentName", compartmentName);
      config.set("compartmentId", compartmentId);
    });
}

async function selectComputeShape() {
  const listComputeShapes = await getEFlexShapes(
    profile,
    regionName,
    compartmentId
  );

  await inquirer
    .prompt([
      {
        type: "list",
        name: "instance_shape",
        message: "Select the Compute Shape",
        choices: listComputeShapes.sort().reverse(),
      },
    ])
    .then((answers) => {
      config.set("instanceShape", answers.instance_shape);
    });
}

async function createSSHKeys(name) {
  const sshPathParam = path.join(os.homedir(), ".ssh", name);
  const publicKeyContent = await createSSHKeyPair(sshPathParam);
  config.set("privateKeyPath", sshPathParam);
  config.set("publicKeyContent", publicKeyContent);
  config.set("publicKeyPath", `${sshPathParam}.pub`);
  console.log(`SSH key pair created: ${chalk.green(sshPathParam)}`);
}

async function createAPIKeys() {
  const apiKeyPathParam = path.join(__dirname, "..", ".api");
  const { privateKeyPath, publicKeyPath } = await createRSAKeyPair(
    apiKeyPathParam
  );

  const publicKeyContent = fs.readFileSync(publicKeyPath, "utf8");
  const privateKeyContent = fs.readFileSync(privateKeyPath, "utf8");
  config.set("privateAPIKeyPath", privateKeyPath);
  config.set("privateAPIKeyContent", privateKeyContent.replaceAll("\n", " "));
  config.set("publicAPIKeyContent", publicKeyContent.replaceAll("\n", " "));
  config.set("publicAPIKeyPath", publicKeyPath);
  console.log(`API Signing key pair created: ${chalk.green(apiKeyPathParam)}`);
}

async function createCerts() {
  const certPath = path.join(__dirname, "..", ".certs");
  await $`mkdir -p ${certPath}`;
  await createSelfSignedCert(certPath);
  config.set("certFullchain", path.join(certPath, "tls.crt"));
  config.set("certPrivateKey", path.join(certPath, "tls.key"));
}
