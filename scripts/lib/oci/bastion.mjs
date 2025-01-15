import { exitWithError } from "../utils.mjs";
import { spinner } from "zx";

export async function listBastionSessions({ regionName, profile }, bastionId) {
  if (!regionName) {
    exitWithError("regionName required");
  }
  if (!profile) {
    exitWithError("profile required");
  }
  if (!bastionId) {
    exitWithError("bastionId required");
  }
  try {
    const { stdout, exitCode, stderr } =
      await $`oci bastion session list --all \
        --bastion-id "${bastionId}" \
        --profile "${profile}" \
        --region "${regionName}"`;
    if (exitCode !== 0) {
      exitWithError(stderr);
    }
    if (!stdout.length) return [];
    const data = JSON.parse(stdout.trim()).data;
    return data.filter((r) => r["lifecycle-state"] === "ACTIVE");
  } catch (error) {
    exitWithError(`Error: listBastionSessions() ${error.message}`);
  }
}

export async function getBastionSessionCommand(
  { regionName, profile },
  sessionId
) {
  if (!regionName) {
    exitWithError("regionName required");
  }
  if (!profile) {
    exitWithError("profile required");
  }
  if (!sessionId) {
    exitWithError("sessionId required");
  }
  try {
    const output = (
      await $`oci bastion session get \
        --session-id "${sessionId}" \
        --profile "${profile}"\
        --region "${regionName}"`
    ).stdout.trim();
    const { data } = JSON.parse(output);
    const command = data["ssh-metadata"].command;
    return command;
  } catch (error) {
    exitWithError(`Error: getBastionSessionCommand() ${error.message}`);
  }
}

export async function createManagedSSHSessionCommand(
  { regionName, profile },
  bastionId,
  displayName,
  targetResourceId,
  publicKeyPath,
  osUsername
) {
  if (!regionName) {
    exitWithError("regionName required");
  }
  if (!profile) {
    exitWithError("profile required");
  }
  if (!bastionId) {
    exitWithError("bastionId required");
  }
  if (!targetResourceId) {
    exitWithError("targetResourceId required");
  }
  if (!displayName) {
    exitWithError("displayName required");
  }
  if (!publicKeyPath) {
    exitWithError("publicKeyPath required");
  }
  if (!osUsername) {
    exitWithError("osUsername required");
  }
  try {
    const output = (
      await spinner(
        "creating session...",
        () => $`oci bastion session create-managed-ssh \
        --bastion-id "${bastionId}" \
        --display-name "${displayName}" \
        --session-ttl 10800 \
        --ssh-public-key-file "${publicKeyPath}" \
        --target-os-username "${osUsername}" \
        --target-resource-id "${targetResourceId}" \
        --wait-for-state "SUCCEEDED" \
        --profile "${profile}" \
        --region "${regionName}"`
      )
    ).stdout.trim();

    const { data } = JSON.parse(output);
    const sessionList = await listBastionSessions(
      { regionName, profile },
      bastionId
    );
    const sessionId = sessionList[0].id;
    return await getBastionSessionCommand({ regionName, profile }, sessionId);
  } catch (error) {
    exitWithError(`Error: createManagedSSHSessionCommand() ${error.message}`);
  }
}
