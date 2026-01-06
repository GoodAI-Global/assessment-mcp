/**
 * Good AI - Generate Executive Summary Tool
 * "Leverage, not lore" — Comprehensive one-page overview for leadership
 */

import { z } from "zod";
import type { Industry } from "../types/index.js";

// ============================================
// Input Schema
// ============================================

export const GenerateExecutiveSummaryInputSchema = z.object({
  company_name: z.string().min(1).max(200),
  industry: z.enum(["manufacturing", "insurance", "aquaculture", "healthcare", "general"]),
  assessment_date: z.string().max(50).optional(),
  readiness_assessment: z.object({
    overall_score: z.number().min(0).max(10),
    dimensions: z.object({
      data_readiness: z.object({ score: z.number(), findings: z.array(z.string()) }),
      technical_capability: z.object({ score: z.number(), findings: z.array(z.string()) }),
      process_maturity: z.object({ score: z.number(), findings: z.array(z.string()) }),
      organizational_readiness: z.object({ score: z.number(), findings: z.array(z.string()) }),
    }),
    strengths: z.array(z.string()).max(20),
    gaps: z.array(z.string()).max(20),
    recommended_starting_point: z.string().max(1000),
    estimated_time_to_value_weeks: z.number(),
    red_flags: z.array(z.string()).max(10),
  }),
  top_bottlenecks: z
    .array(
      z.object({
        name: z.string().max(200),
        estimated_annual_cost_usd: z.number(),
        ai_solution_fit_score: z.number(),
        recommended_ai_approach: z.string().max(500),
        complexity: z.enum(["low", "medium", "high"]),
      })
    )
    .max(10),
  pilot_plan: z
    .object({
      pilot_name: z.string().max(300),
      duration_weeks: z.number(),
      estimated_cost_usd: z.number(),
      success_metrics: z.array(z.string()).max(10),
    })
    .optional(),
  roi_projection: z
    .object({
      expected_roi_percent: z.number(),
      payback_period_months: z.number(),
      net_present_value_usd: z.number(),
      annual_savings_usd: z.number(),
      confidence_level: z.enum(["low", "medium", "high"]),
    })
    .optional(),
  executive_sponsor: z.string().max(200).optional(),
  prepared_by: z.string().max(200).optional(),
});

export type GenerateExecutiveSummaryInput = z.infer<typeof GenerateExecutiveSummaryInputSchema>;

// ============================================
// Output Types
// ============================================

export interface ExecutiveSummary {
  /** Document header */
  header: {
    title: string;
    company: string;
    date: string;
    prepared_by: string;
    executive_sponsor?: string;
  };
  /** High-level snapshot for executives */
  snapshot: {
    readiness_score: number;
    readiness_label: string;
    primary_opportunity: string;
    estimated_annual_value_usd: number;
    recommended_investment_usd: number;
    expected_roi_percent: number;
    time_to_value_weeks: number;
    risk_level: "low" | "medium" | "high";
  };
  /** Key findings organized for quick scanning */
  key_findings: {
    strengths: string[];
    challenges: string[];
    opportunities: string[];
  };
  /** Strategic recommendation summary */
  recommendation: {
    title: string;
    description: string;
    approach: string;
    why_now: string;
  };
  /** Financial summary */
  financial_summary: {
    investment_required_usd: number;
    annual_savings_usd: number;
    payback_period_months: number;
    three_year_value_usd: number;
    roi_percent: number;
    confidence: string;
  };
  /** Implementation timeline summary */
  implementation_timeline: {
    phase_1: { name: string; duration: string; outcome: string };
    phase_2: { name: string; duration: string; outcome: string };
    phase_3: { name: string; duration: string; outcome: string };
  };
  /** Success criteria for pilot */
  success_criteria: string[];
  /** Risk factors and mitigations */
  risk_summary: {
    risk: string;
    mitigation: string;
  }[];
  /** Next steps for decision makers */
  next_steps: string[];
  /** Good AI methodology note */
  methodology_note: string;
}

// ============================================
// Tool Definition
// ============================================

export const GENERATE_EXECUTIVE_SUMMARY_TOOL = {
  name: "generate_executive_summary",
  description:
    "Generates a comprehensive one-page executive summary combining AI readiness assessment, bottleneck analysis, pilot plan, and ROI projections into a decision-ready document for leadership.",
  inputSchema: {
    type: "object",
    properties: {
      company_name: { type: "string", description: "Company name" },
      industry: {
        type: "string",
        enum: ["manufacturing", "insurance", "aquaculture", "healthcare", "general"],
      },
      assessment_date: { type: "string", description: "Assessment date (optional)" },
      readiness_assessment: {
        type: "object",
        description: "Output from assess_ai_readiness tool",
      },
      top_bottlenecks: {
        type: "array",
        description: "Top bottlenecks from identify_bottlenecks tool",
      },
      pilot_plan: {
        type: "object",
        description: "Output from generate_pilot_plan tool (optional)",
      },
      roi_projection: {
        type: "object",
        description: "Output from calculate_roi tool (optional)",
      },
      executive_sponsor: { type: "string", description: "Executive sponsor name" },
      prepared_by: { type: "string", description: "Consultant name" },
    },
    required: ["company_name", "industry", "readiness_assessment", "top_bottlenecks"],
  },
};

// ============================================
// Implementation
// ============================================

function getReadinessLabel(score: number): string {
  if (score >= 8) {
    return "AI Ready";
  }
  if (score >= 6) {
    return "Emerging";
  }
  if (score >= 4) {
    return "Developing";
  }
  return "Early Stage";
}

function calculateRiskLevel(
  readinessScore: number,
  complexity: string,
  redFlagsCount: number
): "low" | "medium" | "high" {
  let riskScore = 0;

  if (readinessScore < 4) {
    riskScore += 2;
  } else if (readinessScore < 6) {
    riskScore += 1;
  }

  if (complexity === "high") {
    riskScore += 2;
  } else if (complexity === "medium") {
    riskScore += 1;
  }

  if (redFlagsCount > 2) {
    riskScore += 2;
  } else if (redFlagsCount > 0) {
    riskScore += 1;
  }

  if (riskScore >= 4) {
    return "high";
  }
  if (riskScore >= 2) {
    return "medium";
  }
  return "low";
}

function generateOpportunities(
  bottlenecks: GenerateExecutiveSummaryInput["top_bottlenecks"],
  industry: Industry
): string[] {
  const opportunities: string[] = [];

  // Add opportunities from high-fit bottlenecks
  bottlenecks
    .filter((b) => b.ai_solution_fit_score >= 7)
    .slice(0, 2)
    .forEach((b) => {
      opportunities.push(
        `${b.name}: ${b.recommended_ai_approach} (${Math.round(b.estimated_annual_cost_usd / 1000)}K annual impact)`
      );
    });

  // Add industry-specific opportunities
  const industryOpportunities: Record<Industry, string[]> = {
    manufacturing: [
      "Predictive maintenance to reduce downtime",
      "Quality control automation using computer vision",
    ],
    insurance: ["Claims processing automation", "Risk assessment using ML models"],
    aquaculture: [
      "Feed optimization through sensor data analysis",
      "Growth prediction and harvest timing",
    ],
    healthcare: ["Patient scheduling optimization", "Documentation automation"],
    general: ["Process automation opportunities", "Data-driven decision support"],
  };

  const industryOps = industryOpportunities[industry];
  if (industryOps && opportunities.length < 3) {
    opportunities.push(...industryOps.slice(0, 3 - opportunities.length));
  }

  return opportunities.slice(0, 4);
}

function generateTimeline(
  durationWeeks: number,
  complexity: string
): ExecutiveSummary["implementation_timeline"] {
  const phase1Weeks = Math.ceil(durationWeeks * 0.25);
  const phase2Weeks = Math.ceil(durationWeeks * 0.5);

  return {
    phase_1: {
      name: "Discovery & Setup",
      duration: `Weeks 1-${phase1Weeks}`,
      outcome: "Requirements validated, environment configured, baseline established",
    },
    phase_2: {
      name: "Development & Integration",
      duration: `Weeks ${phase1Weeks + 1}-${phase1Weeks + phase2Weeks}`,
      outcome:
        complexity === "high"
          ? "Core AI solution deployed, integrations complete, initial training"
          : "AI solution deployed, integrated with existing workflows",
    },
    phase_3: {
      name: "Validation & Optimization",
      duration: `Weeks ${phase1Weeks + phase2Weeks + 1}-${durationWeeks}`,
      outcome: "Performance validated, team trained, handoff complete",
    },
  };
}

function generateRiskSummary(
  readinessAssessment: GenerateExecutiveSummaryInput["readiness_assessment"],
  complexity: string
): ExecutiveSummary["risk_summary"] {
  const risks: ExecutiveSummary["risk_summary"] = [];

  // Check for data risks
  if (readinessAssessment.dimensions.data_readiness.score < 5) {
    risks.push({
      risk: "Data infrastructure gaps may slow implementation",
      mitigation: "Implement lightweight data capture alongside AI deployment",
    });
  }

  // Check for organizational risks
  if (readinessAssessment.dimensions.organizational_readiness.score < 5) {
    risks.push({
      risk: "Change management challenges possible",
      mitigation: "Early stakeholder engagement and phased rollout",
    });
  }

  // Check for complexity risks
  if (complexity === "high") {
    risks.push({
      risk: "Technical complexity may extend timeline",
      mitigation: "Modular approach with early value delivery milestones",
    });
  }

  // Check for red flags
  if (readinessAssessment.red_flags.length > 0) {
    risks.push({
      risk: readinessAssessment.red_flags[0],
      mitigation: "Address critical gaps in parallel with pilot",
    });
  }

  // Always add integration risk
  if (risks.length < 3) {
    risks.push({
      risk: "Integration with existing systems",
      mitigation: "API-first, non-invasive approach that preserves current workflows",
    });
  }

  return risks.slice(0, 4);
}

function generateNextSteps(hasExecutiveSponsor: boolean): string[] {
  const steps = [
    "Review and approve executive summary",
    "Confirm pilot scope and success metrics",
    "Allocate pilot budget and resources",
    "Schedule kickoff meeting for Week 1",
  ];

  if (!hasExecutiveSponsor) {
    steps.unshift("Identify executive sponsor for AI initiative");
  }

  return steps.slice(0, 5);
}

export function generateExecutiveSummary(input: GenerateExecutiveSummaryInput): ExecutiveSummary {
  const {
    company_name,
    industry,
    assessment_date,
    readiness_assessment,
    top_bottlenecks,
    pilot_plan,
    roi_projection,
    executive_sponsor,
    prepared_by,
  } = input;

  const primaryBottleneck = top_bottlenecks[0];
  const complexity = primaryBottleneck?.complexity || "medium";
  const durationWeeks =
    pilot_plan?.duration_weeks || readiness_assessment.estimated_time_to_value_weeks;
  const investmentUsd =
    pilot_plan?.estimated_cost_usd ||
    (complexity === "high" ? 150000 : complexity === "medium" ? 80000 : 40000);

  const estimatedAnnualValue = top_bottlenecks.reduce(
    (sum, b) => sum + b.estimated_annual_cost_usd * (b.ai_solution_fit_score / 10),
    0
  );

  const roiPercent =
    roi_projection?.expected_roi_percent ||
    Math.round(((estimatedAnnualValue - investmentUsd) / investmentUsd) * 100);
  const paybackMonths =
    roi_projection?.payback_period_months || Math.ceil(investmentUsd / (estimatedAnnualValue / 12));
  const annualSavingsUsd =
    roi_projection?.annual_savings_usd || Math.round(estimatedAnnualValue * 0.7); // Conservative estimate

  return {
    header: {
      title: "AI Transformation Executive Summary",
      company: company_name,
      date: assessment_date || new Date().toISOString().split("T")[0],
      prepared_by: prepared_by || "Good AI Consulting",
      executive_sponsor,
    },

    snapshot: {
      readiness_score: readiness_assessment.overall_score,
      readiness_label: getReadinessLabel(readiness_assessment.overall_score),
      primary_opportunity: primaryBottleneck?.name || "Process optimization",
      estimated_annual_value_usd: Math.round(estimatedAnnualValue),
      recommended_investment_usd: investmentUsd,
      expected_roi_percent: roiPercent,
      time_to_value_weeks: durationWeeks,
      risk_level: calculateRiskLevel(
        readiness_assessment.overall_score,
        complexity,
        readiness_assessment.red_flags.length
      ),
    },

    key_findings: {
      strengths: readiness_assessment.strengths.slice(0, 3),
      challenges: readiness_assessment.gaps.slice(0, 3),
      opportunities: generateOpportunities(top_bottlenecks, industry),
    },

    recommendation: {
      title: primaryBottleneck?.name || "AI-Powered Process Improvement",
      description: readiness_assessment.recommended_starting_point,
      approach: primaryBottleneck?.recommended_ai_approach || "Phased AI implementation",
      why_now: `With a ${readiness_assessment.overall_score.toFixed(1)}/10 readiness score and ${top_bottlenecks.length} identified opportunities, the organization is positioned to achieve ${durationWeeks}-week time to value through targeted AI deployment.`,
    },

    financial_summary: {
      investment_required_usd: investmentUsd,
      annual_savings_usd: annualSavingsUsd,
      payback_period_months: Math.min(paybackMonths, 36),
      three_year_value_usd: Math.round(annualSavingsUsd * 3 - investmentUsd),
      roi_percent: roiPercent,
      confidence:
        roi_projection?.confidence_level ||
        (readiness_assessment.overall_score >= 6 ? "medium" : "low"),
    },

    implementation_timeline: generateTimeline(durationWeeks, complexity),

    success_criteria: pilot_plan?.success_metrics.slice(0, 5) || [
      "Measurable reduction in target process time",
      "Validated accuracy of AI predictions/outputs",
      "User adoption above 70%",
      "Documented ROI evidence for scaling decision",
    ],

    risk_summary: generateRiskSummary(readiness_assessment, complexity),

    next_steps: generateNextSteps(!!executive_sponsor),

    methodology_note:
      "This assessment follows Good AI methodology: 'Leverage, not lore' (immediate value), 'Evidence over opinions' (data-driven), 'Augment first' (enhance existing capabilities), and 'Non-invasive by default' (minimal disruption).",
  };
}
