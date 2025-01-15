#!/usr/bin/env zx
import { exitWithError } from "../utils.mjs";
import { where, uniq, sortBy } from "underscore";

export async function listDataScienceSessionShapes(
  { profile, region },
  compartmentId,
  shapeFamily
) {
  try {
    const { stdout, exitCode, stderr } =
      await $`oci data-science notebook-session-shape list \
    --compartment-id ${compartmentId} \
    --profile ${profile} \
    --region ${region}`;
    if (exitCode !== 0) {
      exitWithError(stderr);
    }
    if (!stdout.length) return [];
    const listShapes = JSON.parse(stdout.trim()).data;
    const filteredShapes = shapeFamily
      ? listShapes.filter((s) => s["shape-series"] === shapeFamily)
      : listShapes;
    return sortBy(uniq(filteredShapes));
  } catch (error) {
    exitWithError(`Error: listDataScienceSessionShapes() ${error.stderr}`);
  }
}

export async function listDataScienceSessionShapesFamilies(
  { profile, region },
  compartmentId
) {
  try {
    const { stdout, exitCode, stderr } =
      await $`oci data-science notebook-session-shape list \
    --compartment-id ${compartmentId} \
    --profile ${profile} \
    --region ${region}`;
    if (exitCode !== 0) {
      exitWithError(stderr);
    }
    if (!stdout.length) return [];
    const listShapes = JSON.parse(stdout.trim()).data.filter(
      (s) => s["shape-series"] !== "UNKNOWN_ENUM_VALUE"
    );
    return sortBy(uniq(listShapes.map((s) => s["shape-series"])));
  } catch (error) {
    exitWithError(
      `Error: listDataScienceSessionShapesFamilies() ${error.stderr}`
    );
  }
}
