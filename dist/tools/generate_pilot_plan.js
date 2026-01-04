/**
 * Good AI - Generate Pilot Plan Tool
 * "Non-invasive by default" — Solutions that bypass legacy constraints
 */
import { z } from "zod";
// ============================================
// Input Schema (Zod validation)
// ============================================
export const GeneratePilotPlanInputSchema = z.object({
    selected_bottleneck: z.object({
        name: z.string(),
        description: z.string(),
        estimated_annual_cost_usd: z.number(),
        ai_solution_fit_score: z.number(),
        recommended_ai_approach: z.string(),
        complexity: z.enum(["low", "medium", "high"]),
    }),
    constraints: z.object({
        max_budget_usd: z.number().positive().optional(),
        max_duration_weeks: z.number().int().positive().optional(),
        required_stakeholder_approval: z.boolean().optional(),
        technical_constraints: z.array(z.string()).optional(),
    }),
    company_context: z.object({
        company_name: z.string(),
        industry: z.enum(["manufacturing", "insurance", "aquaculture", "healthcare", "general"]),
        employee_count: z.number().int().positive(),
    }),
});
// ============================================
// Pilot Plan Generation Functions
// ============================================
function generateMilestones(complexity, durationWeeks, approach) {
    const milestones = [];
    // Week 1: Discovery (always)
    milestones.push({
        week: 1,
        deliverable: "Discovery & Requirements",
        success_criteria: "Stakeholder alignment, data requirements documented, success metrics defined",
    });
    if (complexity === "low") {
        milestones.push({
            week: 2,
            deliverable: "Proof of Concept",
            success_criteria: "Working prototype with sample data demonstrating core functionality",
        });
        milestones.push({
            week: Math.min(3, durationWeeks),
            deliverable: "Pilot Deployment",
            success_criteria: "Solution deployed in controlled environment with real data",
        });
        milestones.push({
            week: Math.min(4, durationWeeks),
            deliverable: "Validation & Handoff",
            success_criteria: "Success metrics validated, documentation complete, team trained",
        });
    }
    else if (complexity === "medium") {
        milestones.push({
            week: 2,
            deliverable: "Data Integration",
            success_criteria: "Data pipelines established, quality validation complete",
        });
        milestones.push({
            week: 4,
            deliverable: "MVP Development",
            success_criteria: "Core AI functionality working with real data",
        });
        milestones.push({
            week: 6,
            deliverable: "User Acceptance Testing",
            success_criteria: "End users validate solution meets requirements",
        });
        milestones.push({
            week: Math.min(8, durationWeeks),
            deliverable: "Pilot Completion",
            success_criteria: "Success metrics achieved, scale-up plan documented",
        });
    }
    else {
        // high complexity
        milestones.push({
            week: 2,
            deliverable: "Technical Architecture",
            success_criteria: "Architecture approved, integration points mapped",
        });
        milestones.push({
            week: 4,
            deliverable: "Data Foundation",
            success_criteria: "Data pipelines operational, quality thresholds met",
        });
        milestones.push({
            week: 6,
            deliverable: "Core AI Development",
            success_criteria: "Primary AI model trained and validated",
        });
        milestones.push({
            week: 8,
            deliverable: "Integration & Testing",
            success_criteria: "System integrated with existing infrastructure",
        });
        milestones.push({
            week: 10,
            deliverable: "User Acceptance",
            success_criteria: "End-to-end testing complete with real users",
        });
        milestones.push({
            week: Math.min(12, durationWeeks),
            deliverable: "Pilot Completion",
            success_criteria: "Full validation complete, production roadmap defined",
        });
    }
    // Filter milestones that exceed duration
    return milestones.filter((m) => m.week <= durationWeeks);
}
function generateSuccessMetrics(bottleneckName, approach) {
    const metrics = [];
    const nameLower = bottleneckName.toLowerCase();
    const approachLower = approach.toLowerCase();
    // Universal metrics
    metrics.push("User adoption rate > 80%");
    metrics.push("System availability > 99%");
    // Context-specific metrics
    if (nameLower.includes("quality") || approachLower.includes("vision")) {
        metrics.push("Defect detection accuracy > 95%");
        metrics.push("False positive rate < 5%");
        metrics.push("Processing time reduction > 50%");
    }
    if (nameLower.includes("data entry") || approachLower.includes("ocr")) {
        metrics.push("Data extraction accuracy > 98%");
        metrics.push("Manual entry reduction > 70%");
        metrics.push("Processing time per document < 30 seconds");
    }
    if (nameLower.includes("delay") || nameLower.includes("processing")) {
        metrics.push("Cycle time reduction > 30%");
        metrics.push("Throughput increase > 25%");
    }
    if (nameLower.includes("forecast") || approachLower.includes("predict")) {
        metrics.push("Forecast accuracy improvement > 20%");
        metrics.push("Planning cycle reduction > 40%");
    }
    return metrics.slice(0, 5); // Limit to 5 metrics
}
function generateRiskMitigation(complexity, hasStakeholderApproval) {
    const risks = [];
    risks.push("Weekly progress reviews with stakeholders to ensure alignment");
    risks.push("Parallel manual process maintained during pilot for business continuity");
    if (complexity !== "low") {
        risks.push("Phased rollout to minimize operational disruption");
        risks.push("Dedicated technical support during initial deployment");
    }
    if (hasStakeholderApproval) {
        risks.push("Executive sponsor identified for escalation path");
    }
    if (complexity === "high") {
        risks.push("Fallback plan documented for critical integration points");
        risks.push("Change management program to support user adoption");
    }
    return risks;
}
function estimateCost(complexity, durationWeeks, maxBudget) {
    const baseCosts = {
        low: 15000,
        medium: 35000,
        high: 75000,
    };
    let estimatedCost = baseCosts[complexity] + durationWeeks * 2500;
    if (maxBudget && estimatedCost > maxBudget) {
        estimatedCost = maxBudget;
    }
    return Math.round(estimatedCost);
}
function calculateDuration(complexity, maxDurationWeeks) {
    const defaultDurations = {
        low: 4,
        medium: 8,
        high: 12,
    };
    let duration = defaultDurations[complexity];
    if (maxDurationWeeks && duration > maxDurationWeeks) {
        duration = maxDurationWeeks;
    }
    return duration;
}
// ============================================
// Main Function
// ============================================
export function generatePilotPlan(input) {
    const { selected_bottleneck, constraints, company_context } = input;
    const { complexity, name, recommended_ai_approach } = selected_bottleneck;
    const durationWeeks = calculateDuration(complexity, constraints.max_duration_weeks);
    const estimatedCost = estimateCost(complexity, durationWeeks, constraints.max_budget_usd);
    const pilotName = `${company_context.company_name} - ${name} Pilot`;
    const objective = `Deploy ${recommended_ai_approach} to address ${name.toLowerCase()}, ` +
        `demonstrating measurable improvement within ${durationWeeks} weeks.`;
    const approach = `Following Good AI's non-invasive methodology, this pilot will:\n` +
        `1. Operate alongside existing systems without disruption\n` +
        `2. Use existing data sources with minimal integration\n` +
        `3. Focus on augmenting human decision-making, not replacing it\n` +
        `4. Deliver measurable results before requesting full commitment`;
    const milestones = generateMilestones(complexity, durationWeeks, recommended_ai_approach);
    const successMetrics = generateSuccessMetrics(name, recommended_ai_approach);
    const riskMitigation = generateRiskMitigation(complexity, constraints.required_stakeholder_approval ?? false);
    const nextSteps = [
        "Schedule kickoff meeting with key stakeholders",
        "Identify data sources and access requirements",
        "Define success criteria with measurable thresholds",
        "Establish communication cadence (weekly updates recommended)",
        "Document any technical constraints or dependencies",
    ];
    const methodologyNotes = `This pilot follows Good AI's core principles:\n` +
        `• "Leverage, not lore" — Focused on immediate, demonstrable value\n` +
        `• "Evidence over opinions" — Success measured by concrete metrics\n` +
        `• "Augment first" — Enhancing human capability, not replacing it\n` +
        `• "Non-invasive by default" — Minimal disruption to existing operations`;
    return {
        pilot_name: pilotName,
        objective,
        approach,
        duration_weeks: durationWeeks,
        estimated_cost_usd: estimatedCost,
        milestones,
        success_metrics: successMetrics,
        risk_mitigation: riskMitigation,
        next_steps: nextSteps,
        good_ai_methodology_notes: methodologyNotes,
    };
}
// Export schema for MCP server registration
export const GENERATE_PILOT_PLAN_TOOL = {
    name: "generate_pilot_plan",
    description: "Create a detailed pilot implementation plan following Good AI methodology. Generates milestones, success metrics, risk mitigation strategies, and next steps.",
    inputSchema: {
        type: "object",
        properties: {
            selected_bottleneck: {
                type: "object",
                properties: {
                    name: { type: "string", description: "Name of the bottleneck" },
                    description: { type: "string", description: "Detailed description" },
                    estimated_annual_cost_usd: { type: "number", description: "Estimated annual cost" },
                    ai_solution_fit_score: { type: "number", description: "AI fit score (1-10)" },
                    recommended_ai_approach: { type: "string", description: "Recommended AI solution" },
                    complexity: {
                        type: "string",
                        enum: ["low", "medium", "high"],
                        description: "Implementation complexity",
                    },
                },
                required: [
                    "name",
                    "description",
                    "estimated_annual_cost_usd",
                    "ai_solution_fit_score",
                    "recommended_ai_approach",
                    "complexity",
                ],
            },
            constraints: {
                type: "object",
                properties: {
                    max_budget_usd: { type: "number", description: "Maximum budget in USD" },
                    max_duration_weeks: { type: "number", description: "Maximum duration in weeks" },
                    required_stakeholder_approval: {
                        type: "boolean",
                        description: "Whether stakeholder approval is required",
                    },
                    technical_constraints: {
                        type: "array",
                        items: { type: "string" },
                        description: "List of technical constraints",
                    },
                },
            },
            company_context: {
                type: "object",
                properties: {
                    company_name: { type: "string", description: "Company name" },
                    industry: {
                        type: "string",
                        enum: ["manufacturing", "insurance", "aquaculture", "healthcare", "general"],
                        description: "Industry sector",
                    },
                    employee_count: { type: "number", description: "Number of employees" },
                },
                required: ["company_name", "industry", "employee_count"],
            },
        },
        required: ["selected_bottleneck", "constraints", "company_context"],
    },
};
//# sourceMappingURL=generate_pilot_plan.js.map