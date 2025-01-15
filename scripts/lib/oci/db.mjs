#!/usr/bin/env zx
import { exitWithError } from "../utils.mjs";
import { where, uniq, sortBy } from "underscore";

export async function listDBShapeFamilies({ profile, region }, compartmentId) {
  try {
    const { stdout, exitCode, stderr } = await $`oci db system-shape list \
    --compartment-id ${compartmentId} \
    --profile ${profile} \
    --region ${region}`;
    if (exitCode !== 0) {
      exitWithError(stderr);
    }
    if (!stdout.length) return [];
    const listDbShapeFamilies = JSON.parse(stdout.trim()).data.map(
      (shape) => shape["shape-family"]
    );
    return sortBy(uniq(listDbShapeFamilies));
  } catch (error) {
    exitWithError(`Error: listDBShapeFamilies() ${error.stderr}`);
  }
}

export async function listADBExaShapeFamilies(
  { profile = "DEFAULT", region },
  compartmentId,
  adName
) {
  if (!region) {
    exitWithError("Region required");
  }
  if (!compartmentId) {
    exitWithError("Compartment Id required");
  }
  if (!adName) {
    exitWithError("Availability Domain required");
  }
  try {
    const { stdout, exitCode, stderr } =
      await $`oci db autonomous-exadata-infrastructure \
      shape list \
      --compartment-id ${compartmentId} \
      --availability-domain ${adName} \
      --profile ${profile} \
      --region ${region}`;
    if (exitCode !== 0) {
      exitWithError(stderr);
    }
    if (!stdout.length) return [];
    const listDbShapeFamilies = JSON.parse(stdout.trim()).data.map(
      (shape) => shape["name"]
    );
    return sortBy(uniq(listDbShapeFamilies));
  } catch (error) {
    exitWithError(`Error: listDBShapeFamilies() ${error.stderr}`);
  }
}

export async function listADBExaVersions(
  { profile = "DEFAULT", region },
  compartmentId
) {
  if (!region) {
    exitWithError("Region required");
  }
  if (!compartmentId) {
    exitWithError("Compartment Id required");
  }
  try {
    const { stdout, exitCode, stderr } =
      await $`oci db autonomous-container-database-version list \
      --compartment-id "${compartmentId}" \
      --service-component "ADBD" \
      --profile ${profile} \
      --region ${region}`;
    if (exitCode !== 0) {
      exitWithError(stderr);
    }
    if (!stdout.length) return [];
    const versions = JSON.parse(stdout.trim()).data.map(
      (item) => item["version"]
    );
    return sortBy(uniq(versions));
  } catch (error) {
    exitWithError(`Error: listADBExaVersions() ${error.stderr}`);
  }
}

export async function listDBShapes(
  { profile, region },
  compartmentId,
  shapeFamily
) {
  try {
    const { stdout, exitCode, stderr } = await $`oci db system-shape list \
            --compartment-id ${compartmentId} \
            --profile ${profile} \
            --region ${region}`;
    if (exitCode !== 0) {
      exitWithError(stderr);
    }
    if (!stdout.length) return [];
    const listItemsDbShapes = JSON.parse(stdout.trim()).data;
    const filteredDbShapes = shapeFamily
      ? where(listItemsDbShapes, {
          "shape-family": shapeFamily,
        })
      : listItemsDbShapes;
    return filteredDbShapes;
  } catch (error) {
    exitWithError(`Error: listDBShapes() ${error.stderr}`);
  }
}
