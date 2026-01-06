/**
 * Good AI - Identify Bottlenecks Tool
 * "Augment first" — Identify augmentation opportunities before automation
 */

import { z } from "zod";
import type {
  IdentifyBottlenecksInput,
  IdentifyBottlenecksOutput,
  Bottleneck,
} from "../types/index.js";

// ============================================
// Input Schema (Zod validation)
// ============================================

export const IdentifyBottlenecksInputSchema = z.object({
  process_description: z
    .string()
    .min(10, "Process description must be at least 10 characters")
    .max(5000, "Process description too long"),
  metrics: z.object({
    cycle_time_hours: z.number().positive().max(100_000, "Cycle time unrealistic").optional(),
    error_rate_percent: z.number().min(0).max(100).optional(),
    manual_steps_count: z.number().int().min(0).max(10_000, "Step count unrealistic").optional(),
    cost_per_unit_usd: z.number().positive().max(1_000_000_000, "Cost unrealistic").optional(),
  }),
  pain_points: z
    .array(z.string().max(1000, "Pain point too long"))
    .min(1, "At least one pain point is required")
    .max(50, "Too many pain points"),
  industry: z.enum(["manufacturing", "insurance", "aquaculture", "healthcare", "general"]),
});

// ============================================
// Bottleneck Analysis Functions
// ============================================

function analyzeBottlenecks(input: IdentifyBottlenecksInput): Bottleneck[] {
  const bottlenecks: Bottleneck[] = [];
  const { metrics, pain_points, industry, process_description } = input;
  const processLower = process_description.toLowerCase();

  // Analyze based on metrics
  if (metrics.error_rate_percent && metrics.error_rate_percent > 5) {
    const estimatedCost = metrics.cost_per_unit_usd
      ? Math.round(metrics.cost_per_unit_usd * metrics.error_rate_percent * 100 * 12)
      : 50000;

    bottlenecks.push({
      name: "Quality Control Gaps",
      description: `Error rate of ${metrics.error_rate_percent}% exceeds industry standard. High defect/rework costs.`,
      estimated_annual_cost_usd: estimatedCost,
      ai_solution_fit_score: 8,
      recommended_ai_approach: "Computer Vision for automated quality inspection",
      complexity: metrics.error_rate_percent > 15 ? "high" : "medium",
    });
  }

  if (metrics.manual_steps_count && metrics.manual_steps_count > 5) {
    const estimatedCost = metrics.manual_steps_count * 15000; // ~$15k per manual step annually

    bottlenecks.push({
      name: "Manual Process Overhead",
      description: `${metrics.manual_steps_count} manual steps create delays and inconsistency.`,
      estimated_annual_cost_usd: estimatedCost,
      ai_solution_fit_score: 7,
      recommended_ai_approach: "Process automation with human-in-the-loop validation",
      complexity: metrics.manual_steps_count > 10 ? "high" : "medium",
    });
  }

  if (metrics.cycle_time_hours && metrics.cycle_time_hours > 24) {
    const estimatedCost = Math.round(metrics.cycle_time_hours * 1000 * 12);

    bottlenecks.push({
      name: "Processing Delays",
      description: `Cycle time of ${metrics.cycle_time_hours} hours impacts throughput and customer satisfaction.`,
      estimated_annual_cost_usd: estimatedCost,
      ai_solution_fit_score: 6,
      recommended_ai_approach: "Predictive scheduling and workflow optimization",
      complexity: "medium",
    });
  }

  // Analyze pain points with keyword matching
  for (const painPoint of pain_points) {
    const painLower = painPoint.toLowerCase();

    if (painLower.includes("data entry") || painLower.includes("manual input")) {
      bottlenecks.push({
        name: "Data Entry Bottleneck",
        description: painPoint,
        estimated_annual_cost_usd: 45000,
        ai_solution_fit_score: 9,
        recommended_ai_approach: "OCR and document extraction with validation workflow",
        complexity: "low",
      });
    }

    if (painLower.includes("inspection") || painLower.includes("visual")) {
      bottlenecks.push({
        name: "Visual Inspection Delays",
        description: painPoint,
        estimated_annual_cost_usd: 75000,
        ai_solution_fit_score: 9,
        recommended_ai_approach: "Computer Vision for automated visual inspection",
        complexity: "medium",
      });
    }

    if (painLower.includes("prediction") || painLower.includes("forecast")) {
      bottlenecks.push({
        name: "Forecasting Limitations",
        description: painPoint,
        estimated_annual_cost_usd: 60000,
        ai_solution_fit_score: 7,
        recommended_ai_approach: "ML-based demand forecasting and predictive analytics",
        complexity: "medium",
      });
    }

    if (painLower.includes("communication") || painLower.includes("coordination")) {
      bottlenecks.push({
        name: "Communication Gaps",
        description: painPoint,
        estimated_annual_cost_usd: 30000,
        ai_solution_fit_score: 5,
        recommended_ai_approach: "AI-assisted communication and workflow coordination",
        complexity: "low",
      });
    }
  }

  // Industry-specific bottleneck detection
  if (industry === "aquaculture") {
    if (
      processLower.includes("feed") ||
      pain_points.some((p) => p.toLowerCase().includes("feed"))
    ) {
      bottlenecks.push({
        name: "Feed Optimization",
        description:
          "Suboptimal feed timing and quantity leading to waste and reduced growth rates.",
        estimated_annual_cost_usd: 80000,
        ai_solution_fit_score: 8,
        recommended_ai_approach: "Computer Vision and ML for automated feed optimization",
        complexity: "medium",
      });
    }
  }

  if (industry === "insurance") {
    if (
      processLower.includes("claim") ||
      pain_points.some((p) => p.toLowerCase().includes("claim"))
    ) {
      bottlenecks.push({
        name: "Claims Processing Delays",
        description: "Manual claims review creates backlogs and customer dissatisfaction.",
        estimated_annual_cost_usd: 120000,
        ai_solution_fit_score: 9,
        recommended_ai_approach: "Document extraction and automated claims triage",
        complexity: "medium",
      });
    }
  }

  // Sort by AI solution fit score (descending)
  bottlenecks.sort((a, b) => b.ai_solution_fit_score - a.ai_solution_fit_score);

  // Remove duplicates by name
  const seen = new Set<string>();
  return bottlenecks.filter((b) => {
    if (seen.has(b.name)) {
      return false;
    }
    seen.add(b.name);
    return true;
  });
}

function identifyQuickWins(bottlenecks: Bottleneck[]): string[] {
  return bottlenecks
    .filter((b) => b.complexity === "low" && b.ai_solution_fit_score >= 7)
    .map((b) => `${b.name}: ${b.recommended_ai_approach}`);
}

// ============================================
// Main Function
// ============================================

export function identifyBottlenecks(input: IdentifyBottlenecksInput): IdentifyBottlenecksOutput {
  const bottlenecks = analyzeBottlenecks(input);

  const totalEstimatedWaste = bottlenecks.reduce((sum, b) => sum + b.estimated_annual_cost_usd, 0);

  const highestImpact =
    bottlenecks.length > 0
      ? `${bottlenecks[0].name}: ${bottlenecks[0].recommended_ai_approach}`
      : "No significant bottlenecks identified";

  const quickWins = identifyQuickWins(bottlenecks);

  return {
    bottlenecks,
    total_estimated_waste_usd: totalEstimatedWaste,
    highest_impact_opportunity: highestImpact,
    quick_wins: quickWins.length > 0 ? quickWins : ["No immediate quick wins identified"],
  };
}

// Export schema for MCP server registration
export const IDENTIFY_BOTTLENECKS_TOOL = {
  name: "identify_bottlenecks",
  description:
    "Analyze processes to identify operational bottlenecks with cost estimation and AI solution fit scores. Ranks opportunities by impact and implementation complexity.",
  inputSchema: {
    type: "object" as const,
    properties: {
      process_description: {
        type: "string",
        description: "Detailed description of the process being analyzed",
      },
      metrics: {
        type: "object",
        properties: {
          cycle_time_hours: {
            type: "number",
            description: "Average cycle time in hours",
          },
          error_rate_percent: {
            type: "number",
            description: "Error/defect rate as percentage (0-100)",
          },
          manual_steps_count: {
            type: "number",
            description: "Number of manual steps in the process",
          },
          cost_per_unit_usd: {
            type: "number",
            description: "Cost per unit processed in USD",
          },
        },
      },
      pain_points: {
        type: "array",
        items: { type: "string" },
        description: "List of known pain points and challenges",
      },
      industry: {
        type: "string",
        enum: ["manufacturing", "insurance", "aquaculture", "healthcare", "general"],
        description: "Industry sector for context-specific analysis",
      },
    },
    required: ["process_description", "metrics", "pain_points", "industry"],
  },
};
