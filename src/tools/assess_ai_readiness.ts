/**
 * Good AI - Assess AI Readiness Tool
 * "Evidence over opinions" — Assessments based on measurable criteria
 */

import { z } from "zod";
import type {
  AssessAIReadinessInput,
  AssessAIReadinessOutput,
  DimensionScore,
} from "../types/index.js";
import {
  getIndustryRecommendation,
  calculateTimeToValue,
} from "../data/industry_benchmarks.js";

// ============================================
// Input Schema (Zod validation)
// ============================================

export const AssessAIReadinessInputSchema = z.object({
  company_name: z.string().min(1, "Company name is required").max(200, "Company name too long"),
  industry: z.enum([
    "manufacturing",
    "insurance",
    "aquaculture",
    "healthcare",
    "general",
  ]),
  employee_count: z.number().int().positive("Employee count must be positive").max(10_000_000, "Employee count unrealistic"),
  annual_revenue_usd: z.number().positive().max(1_000_000_000_000, "Revenue unrealistic").optional(),
  data_infrastructure: z.object({
    centralized_data: z.boolean(),
    data_quality_score: z.number().min(1).max(10).optional(),
    manual_data_entry_percent: z.number().min(0).max(100),
  }),
  current_systems: z.object({
    erp: z.string().max(100, "ERP name too long").nullable(),
    crm: z.string().max(100, "CRM name too long").nullable(),
    legacy_systems_count: z.number().int().min(0).max(1000, "Legacy count unrealistic"),
  }),
  previous_ai_attempts: z.array(z.string().max(500, "Attempt description too long")).max(50, "Too many attempts").optional(),
});

// ============================================
// Scoring Functions
// ============================================

function calculateDataReadiness(input: AssessAIReadinessInput): DimensionScore {
  let score = 4; // Base score (calibrated for realistic assessment)
  const findings: string[] = [];

  // centralized_data = true: +3
  if (input.data_infrastructure.centralized_data) {
    score += 3;
  } else {
    findings.push("No centralized data repository");
  }

  // manual_data_entry_percent < 30: +3
  if (input.data_infrastructure.manual_data_entry_percent < 30) {
    score += 3;
  }

  // manual_data_entry_percent > 70: -2, add finding
  if (input.data_infrastructure.manual_data_entry_percent > 70) {
    score -= 2;
    findings.push("High manual entry indicates Computer Vision opportunity");
  }

  // data_quality_score > 7: +2
  if (
    input.data_infrastructure.data_quality_score &&
    input.data_infrastructure.data_quality_score > 7
  ) {
    score += 2;
  }

  // Clamp score to 1-10
  score = Math.max(1, Math.min(10, score));

  return { score, findings };
}

function calculateTechnicalCapability(
  input: AssessAIReadinessInput
): DimensionScore {
  let score = 2; // Base score (calibrated for realistic assessment)
  const findings: string[] = [];

  // erp exists: +2
  if (input.current_systems.erp) {
    score += 2;
  }

  // legacy_systems_count < 3: +2
  if (input.current_systems.legacy_systems_count < 3) {
    score += 2;
    findings.push("Low legacy complexity enables faster implementation");
  }

  // legacy_systems_count > 5: -1, add finding
  if (input.current_systems.legacy_systems_count > 5) {
    score -= 1;
    findings.push("Legacy complexity suggests non-invasive approach");
  }

  // CRM bonus
  if (input.current_systems.crm) {
    score += 1;
  }

  // Clamp score to 1-10
  score = Math.max(1, Math.min(10, score));

  return { score, findings };
}

function calculateProcessMaturity(
  input: AssessAIReadinessInput
): DimensionScore {
  let score = 3; // Base score (calibrated for realistic assessment)
  const findings: string[] = [];

  // Larger companies tend to have more mature processes
  if (input.employee_count > 500) {
    score += 2;
  } else if (input.employee_count > 100) {
    score += 1;
  }

  // Previous AI attempts indicate process awareness
  if (input.previous_ai_attempts && input.previous_ai_attempts.length > 0) {
    score += 1;
    if (input.previous_ai_attempts.length >= 3) {
      findings.push("Multiple AI attempts suggest need for structured approach");
    }
  }

  // Low manual entry suggests mature processes
  if (input.data_infrastructure.manual_data_entry_percent < 50) {
    score += 1;
  }

  // Clamp score to 1-10
  score = Math.max(1, Math.min(10, score));

  return { score, findings };
}

function calculateOrganizationalReadiness(
  input: AssessAIReadinessInput
): DimensionScore {
  let score = 2; // Base score (calibrated for realistic assessment)
  const findings: string[] = [];

  // Mid-size companies often more agile
  if (input.employee_count >= 50 && input.employee_count <= 500) {
    score += 2;
  } else if (input.employee_count > 500) {
    score += 1;
    findings.push("Larger organization may require change management focus");
  }

  // Revenue indicates resources for AI investment
  if (input.annual_revenue_usd) {
    if (input.annual_revenue_usd > 50_000_000) {
      score += 2;
    } else if (input.annual_revenue_usd > 10_000_000) {
      score += 1;
    }
  }

  // Previous attempts show willingness
  if (input.previous_ai_attempts && input.previous_ai_attempts.length > 0) {
    score += 1;
  }

  // Clamp score to 1-10
  score = Math.max(1, Math.min(10, score));

  return { score, findings };
}

function identifyStrengths(
  input: AssessAIReadinessInput,
  dataReadiness: DimensionScore,
  technicalCapability: DimensionScore
): string[] {
  const strengths: string[] = [];

  if (input.data_infrastructure.centralized_data) {
    strengths.push("Centralized data foundation");
  }

  if (input.current_systems.legacy_systems_count < 3) {
    strengths.push("Low legacy complexity");
  }

  if (input.data_infrastructure.manual_data_entry_percent > 70) {
    strengths.push("Clear digitization opportunity");
  }

  if (
    input.data_infrastructure.data_quality_score &&
    input.data_infrastructure.data_quality_score > 7
  ) {
    strengths.push("High data quality");
  }

  if (input.current_systems.erp && input.current_systems.crm) {
    strengths.push("Modern system stack");
  }

  if (dataReadiness.score >= 6) {
    strengths.push("Strong data readiness");
  }

  if (technicalCapability.score >= 5) {
    strengths.push("Solid technical infrastructure");
  }

  return strengths;
}

function identifyGaps(input: AssessAIReadinessInput): string[] {
  const gaps: string[] = [];

  if (!input.data_infrastructure.centralized_data) {
    gaps.push("No centralized data");
  }

  if (input.data_infrastructure.manual_data_entry_percent > 50) {
    gaps.push("High manual processes");
  }

  if (!input.current_systems.erp) {
    gaps.push("No ERP system");
  }

  if (input.current_systems.legacy_systems_count > 5) {
    gaps.push("High legacy system complexity");
  }

  if (
    input.data_infrastructure.data_quality_score &&
    input.data_infrastructure.data_quality_score < 5
  ) {
    gaps.push("Data quality concerns");
  }

  return gaps;
}

function determineRedFlags(
  overallScore: number,
  input: AssessAIReadinessInput
): string[] {
  const redFlags: string[] = [];

  // overall_score < 3: add red flag
  if (overallScore < 3) {
    redFlags.push(
      "AI implementation not recommended without foundational improvements"
    );
  }

  // manual_data_entry_percent > 90 AND no ERP
  if (
    input.data_infrastructure.manual_data_entry_percent > 90 &&
    !input.current_systems.erp
  ) {
    redFlags.push("Consider basic digitization before AI");
  }

  // Previous failed attempts without clear learnings
  if (input.previous_ai_attempts && input.previous_ai_attempts.length >= 3) {
    redFlags.push("Multiple previous attempts suggest need for different approach");
  }

  return redFlags;
}

// ============================================
// Main Assessment Function
// ============================================

export function assessAIReadiness(
  input: AssessAIReadinessInput
): AssessAIReadinessOutput {
  // Calculate dimension scores
  const dataReadiness = calculateDataReadiness(input);
  const technicalCapability = calculateTechnicalCapability(input);
  const processMaturity = calculateProcessMaturity(input);
  const organizationalReadiness = calculateOrganizationalReadiness(input);

  // Calculate overall score (average of dimensions)
  const overallScore =
    (dataReadiness.score +
      technicalCapability.score +
      processMaturity.score +
      organizationalReadiness.score) /
    4;

  // Round to 1 decimal place
  const roundedOverallScore = Math.round(overallScore * 10) / 10;

  // Identify strengths and gaps
  const strengths = identifyStrengths(
    input,
    dataReadiness,
    technicalCapability
  );
  const gaps = identifyGaps(input);

  // Determine red flags
  const redFlags = determineRedFlags(roundedOverallScore, input);

  // Get recommendation
  const recommendedStartingPoint = getIndustryRecommendation(
    input.industry,
    input.data_infrastructure.centralized_data,
    input.data_infrastructure.manual_data_entry_percent
  );

  // Calculate time to value
  const estimatedTimeToValueWeeks = calculateTimeToValue(
    input.industry,
    input.data_infrastructure.centralized_data,
    input.current_systems.legacy_systems_count,
    input.data_infrastructure.manual_data_entry_percent
  );

  return {
    overall_score: roundedOverallScore,
    dimensions: {
      data_readiness: dataReadiness,
      technical_capability: technicalCapability,
      process_maturity: processMaturity,
      organizational_readiness: organizationalReadiness,
    },
    strengths,
    gaps,
    recommended_starting_point: recommendedStartingPoint,
    estimated_time_to_value_weeks: estimatedTimeToValueWeeks,
    red_flags: redFlags,
  };
}

// Export schema for MCP server registration
export const ASSESS_AI_READINESS_TOOL = {
  name: "assess_ai_readiness",
  description:
    "Evaluate an organization's readiness for AI implementation. Provides scores across data readiness, technical capability, process maturity, and organizational readiness dimensions. Returns actionable recommendations based on Good AI's 'Leverage, not lore' methodology.",
  inputSchema: {
    type: "object" as const,
    properties: {
      company_name: {
        type: "string",
        description: "Name of the company being assessed",
      },
      industry: {
        type: "string",
        enum: ["manufacturing", "insurance", "aquaculture", "healthcare", "general"],
        description: "Industry sector of the company",
      },
      employee_count: {
        type: "number",
        description: "Total number of employees",
      },
      annual_revenue_usd: {
        type: "number",
        description: "Annual revenue in USD (optional)",
      },
      data_infrastructure: {
        type: "object",
        properties: {
          centralized_data: {
            type: "boolean",
            description: "Whether the company has centralized data storage",
          },
          data_quality_score: {
            type: "number",
            description: "Self-assessed data quality score from 1-10 (optional)",
          },
          manual_data_entry_percent: {
            type: "number",
            description: "Percentage of data entered manually (0-100)",
          },
        },
        required: ["centralized_data", "manual_data_entry_percent"],
      },
      current_systems: {
        type: "object",
        properties: {
          erp: {
            type: ["string", "null"],
            description: "ERP system name or null if none",
          },
          crm: {
            type: ["string", "null"],
            description: "CRM system name or null if none",
          },
          legacy_systems_count: {
            type: "number",
            description: "Number of legacy systems in use",
          },
        },
        required: ["erp", "crm", "legacy_systems_count"],
      },
      previous_ai_attempts: {
        type: "array",
        items: { type: "string" },
        description: "List of previous AI implementation attempts (optional)",
      },
    },
    required: [
      "company_name",
      "industry",
      "employee_count",
      "data_infrastructure",
      "current_systems",
    ],
  },
};
