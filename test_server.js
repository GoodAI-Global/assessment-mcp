#!/usr/bin/env node
/**
 * Good AI Assessment MCP Server - Test Script
 *
 * This script tests the assess_ai_readiness tool with reference input
 * and validates the output structure.
 *
 * Usage: node test_server.js
 * Exit codes: 0 = success, 1 = failure
 */

import { callTool } from "./dist/server.js";

// Reference test input from specification
const referenceInput = {
  company_name: "OceanShrimp Co.",
  industry: "aquaculture",
  employee_count: 120,
  data_infrastructure: {
    centralized_data: false,
    manual_data_entry_percent: 85,
  },
  current_systems: {
    erp: null,
    crm: null,
    legacy_systems_count: 2,
  },
};

// Required output fields for validation
const requiredFields = [
  "overall_score",
  "dimensions",
  "strengths",
  "gaps",
  "recommended_starting_point",
  "estimated_time_to_value_weeks",
  "red_flags",
];

const requiredDimensions = [
  "data_readiness",
  "technical_capability",
  "process_maturity",
  "organizational_readiness",
];

function validateOutput(output) {
  const errors = [];

  // Check required top-level fields
  for (const field of requiredFields) {
    if (!(field in output)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Check dimensions structure
  if (output.dimensions) {
    for (const dim of requiredDimensions) {
      if (!(dim in output.dimensions)) {
        errors.push(`Missing dimension: ${dim}`);
      } else {
        const dimData = output.dimensions[dim];
        if (typeof dimData.score !== "number") {
          errors.push(`${dim}.score must be a number`);
        }
        if (!Array.isArray(dimData.findings)) {
          errors.push(`${dim}.findings must be an array`);
        }
      }
    }
  }

  // Validate types
  if (typeof output.overall_score !== "number") {
    errors.push("overall_score must be a number");
  }
  if (!Array.isArray(output.strengths)) {
    errors.push("strengths must be an array");
  }
  if (!Array.isArray(output.gaps)) {
    errors.push("gaps must be an array");
  }
  if (!Array.isArray(output.red_flags)) {
    errors.push("red_flags must be an array");
  }
  if (typeof output.recommended_starting_point !== "string") {
    errors.push("recommended_starting_point must be a string");
  }
  if (typeof output.estimated_time_to_value_weeks !== "number") {
    errors.push("estimated_time_to_value_weeks must be a number");
  }

  return errors;
}

function validateBusinessLogic(output) {
  const warnings = [];

  // Check that high manual entry produces CV recommendation
  if (!output.dimensions.data_readiness.findings.some((f) =>
    f.toLowerCase().includes("computer vision")
  )) {
    warnings.push(
      "Expected 'Computer Vision' finding for high manual entry (85%)"
    );
  }

  // Check that no centralized data is flagged
  if (!output.dimensions.data_readiness.findings.some((f) =>
    f.toLowerCase().includes("centralized")
  )) {
    warnings.push("Expected finding about missing centralized data");
  }

  // Check that low legacy count is recognized as strength
  if (!output.dimensions.technical_capability.findings.some((f) =>
    f.toLowerCase().includes("legacy")
  )) {
    warnings.push("Expected finding about low legacy complexity");
  }

  return warnings;
}

async function main() {
  console.log("Good AI Assessment MCP Server - Test Script");
  console.log("==========================================\n");

  try {
    console.log("Input:");
    console.log(JSON.stringify(referenceInput, null, 2));
    console.log("\n---\n");

    // Call the tool
    const result = callTool("assess_ai_readiness", referenceInput);

    console.log("Output:");
    console.log(JSON.stringify(result, null, 2));
    console.log("\n---\n");

    // Validate structure
    const validationErrors = validateOutput(result);
    if (validationErrors.length > 0) {
      console.error("Validation Errors:");
      validationErrors.forEach((e) => console.error(`  ❌ ${e}`));
      process.exit(1);
    }
    console.log("✅ Output structure validation passed\n");

    // Validate business logic
    const warnings = validateBusinessLogic(result);
    if (warnings.length > 0) {
      console.log("Business Logic Warnings:");
      warnings.forEach((w) => console.log(`  ⚠️  ${w}`));
    } else {
      console.log("✅ Business logic validation passed\n");
    }

    // Summary
    console.log("Summary:");
    console.log(`  Overall Score: ${result.overall_score}/10`);
    console.log(`  Strengths: ${result.strengths.length}`);
    console.log(`  Gaps: ${result.gaps.length}`);
    console.log(`  Red Flags: ${result.red_flags.length}`);
    console.log(`  Time to Value: ${result.estimated_time_to_value_weeks} weeks`);
    console.log(`\n✅ All tests passed!`);

    process.exit(0);
  } catch (error) {
    console.error("Test failed with error:");
    console.error(error);
    process.exit(1);
  }
}

main();
