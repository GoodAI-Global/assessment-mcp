/**
 * Good AI - Calculate Realized Value Tool
 * Measures and tracks actual value realized from AI implementations
 */

import { z } from "zod";

// ============================================
// Input Schema
// ============================================

export const CalculateRealizedValueInputSchema = z.object({
  project_name: z.string().min(1).max(200),
  client_name: z.string().min(1).max(200),
  industry: z.enum([
    "manufacturing",
    "insurance",
    "aquaculture",
    "healthcare",
    "general",
  ]),

  // Implementation details
  implementation_info: z.object({
    go_live_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
    measurement_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD format"),
    solution_type: z.enum([
      "process_automation",
      "predictive_analytics",
      "document_processing",
      "quality_control",
      "customer_service",
      "supply_chain",
      "general_ai",
    ]).default("general_ai"),
    implementation_cost_usd: z.number().min(0),
    ongoing_monthly_cost_usd: z.number().min(0).default(0),
  }),

  // Projected values (from original business case)
  projected_values: z.object({
    projected_annual_savings_usd: z.number().min(0),
    projected_annual_revenue_increase_usd: z.number().min(0).default(0),
    projected_roi_percent: z.number().optional(),
    projected_payback_months: z.number().optional(),
    key_projected_benefits: z.array(z.string()).max(10).default([]),
  }),

  // Actual measured values
  actual_values: z.object({
    // Cost savings
    labor_cost_savings_monthly_usd: z.number().min(0).default(0),
    process_efficiency_savings_monthly_usd: z.number().min(0).default(0),
    error_reduction_savings_monthly_usd: z.number().min(0).default(0),
    compliance_savings_monthly_usd: z.number().min(0).default(0),
    other_cost_savings_monthly_usd: z.number().min(0).default(0),

    // Revenue impact
    revenue_increase_monthly_usd: z.number().min(0).default(0),
    customer_retention_value_monthly_usd: z.number().min(0).default(0),
    new_capability_revenue_monthly_usd: z.number().min(0).default(0),

    // Productivity metrics
    hours_saved_per_week: z.number().min(0).default(0),
    throughput_increase_percent: z.number().min(0).max(1000).default(0),
    cycle_time_reduction_percent: z.number().min(0).max(100).default(0),

    // Quality metrics
    error_rate_reduction_percent: z.number().min(0).max(100).default(0),
    quality_score_improvement: z.number().min(0).max(100).default(0),
    customer_satisfaction_improvement: z.number().min(-100).max(100).default(0),
  }),

  // Intangible benefits (qualitative)
  intangible_benefits: z.object({
    employee_satisfaction_impact: z.enum(["significant_positive", "positive", "neutral", "negative"]).optional(),
    strategic_capability_value: z.enum(["transformational", "high", "moderate", "low"]).optional(),
    competitive_advantage_impact: z.enum(["significant", "moderate", "minimal", "none"]).optional(),
    risk_reduction_value: z.enum(["high", "moderate", "low", "none"]).optional(),
    scalability_benefit: z.enum(["high", "moderate", "low"]).optional(),
    data_insights_value: z.enum(["high", "moderate", "low"]).optional(),
  }).optional(),

  // Challenges and issues
  challenges: z.object({
    implementation_delays_weeks: z.number().min(0).default(0),
    scope_changes_count: z.number().min(0).default(0),
    adoption_challenges: z.array(z.string()).max(10).default([]),
    unexpected_costs_usd: z.number().min(0).default(0),
    technical_issues_count: z.number().min(0).default(0),
  }).optional(),

  // Future projections
  future_context: z.object({
    planned_expansions: z.array(z.string()).max(10).default([]),
    additional_use_cases_identified: z.number().min(0).default(0),
    optimization_opportunities: z.array(z.string()).max(10).default([]),
  }).optional(),
});

export type CalculateRealizedValueInput = z.infer<typeof CalculateRealizedValueInputSchema>;

// ============================================
// Output Types
// ============================================

export interface RealizedValueCalculation {
  project_name: string;
  client_name: string;
  calculation_date: string;
  measurement_period: {
    go_live_date: string;
    measurement_date: string;
    months_since_go_live: number;
  };

  /** Value summary */
  value_summary: {
    total_realized_value_usd: number;
    annualized_value_usd: number;
    value_vs_projection_percent: number;
    value_realization_status: "exceeding" | "on_track" | "below" | "significantly_below";
    key_value_drivers: string[];
    roi_realized_percent: number;
    payback_achieved: boolean;
    payback_months_actual: number | null;
  };

  /** Detailed value breakdown */
  value_breakdown: {
    cost_savings: {
      total_monthly_usd: number;
      labor_savings_usd: number;
      efficiency_savings_usd: number;
      error_reduction_savings_usd: number;
      compliance_savings_usd: number;
      other_savings_usd: number;
      annualized_total_usd: number;
    };
    revenue_impact: {
      total_monthly_usd: number;
      direct_revenue_increase_usd: number;
      retention_value_usd: number;
      new_capability_revenue_usd: number;
      annualized_total_usd: number;
    };
    productivity_gains: {
      hours_saved_weekly: number;
      hours_saved_annually: number;
      productivity_value_usd: number;
      throughput_improvement_percent: number;
      cycle_time_improvement_percent: number;
    };
    quality_improvements: {
      error_reduction_percent: number;
      quality_score_change: number;
      customer_satisfaction_change: number;
      quality_value_estimate_usd: number;
    };
  };

  /** Comparison to projections */
  projection_comparison: {
    savings_vs_projected: {
      projected_annual_usd: number;
      actual_annualized_usd: number;
      variance_usd: number;
      variance_percent: number;
      status: "ahead" | "on_track" | "behind";
    };
    revenue_vs_projected: {
      projected_annual_usd: number;
      actual_annualized_usd: number;
      variance_usd: number;
      variance_percent: number;
      status: "ahead" | "on_track" | "behind";
    };
    roi_comparison: {
      projected_roi_percent: number | null;
      actual_roi_percent: number;
      roi_variance: number | null;
    };
    benefits_achieved: {
      benefit: string;
      status: "achieved" | "partially_achieved" | "not_achieved" | "exceeded";
      notes: string;
    }[];
  };

  /** Investment analysis */
  investment_analysis: {
    total_investment_usd: number;
    ongoing_costs_to_date_usd: number;
    total_cost_to_date_usd: number;
    total_value_generated_usd: number;
    net_value_usd: number;
    monthly_net_value_usd: number;
    cost_per_value_dollar: number;
    investment_efficiency_rating: "excellent" | "good" | "fair" | "poor";
  };

  /** Intangible value assessment */
  intangible_value: {
    overall_intangible_score: number; // 0-100
    strategic_value: "high" | "medium" | "low";
    employee_impact: string;
    competitive_positioning: string;
    risk_reduction_assessment: string;
    future_option_value: string;
    estimated_intangible_value_usd: number;
  };

  /** Challenges impact */
  challenges_assessment: {
    total_challenge_impact_usd: number;
    implementation_delay_impact_usd: number;
    scope_change_impact_usd: number;
    unexpected_cost_impact_usd: number;
    net_value_after_challenges_usd: number;
    lessons_learned: string[];
  };

  /** Value trajectory */
  value_trajectory: {
    current_monthly_value_usd: number;
    trend: "increasing" | "stable" | "decreasing";
    projected_12_month_value_usd: number;
    projected_36_month_value_usd: number;
    break_even_date: string | null;
    value_acceleration_opportunities: string[];
  };

  /** Executive metrics */
  executive_metrics: {
    headline_roi: string;
    headline_savings: string;
    headline_efficiency: string;
    one_line_summary: string;
    board_ready_metrics: {
      metric: string;
      value: string;
      context: string;
    }[];
  };

  /** Recommendations */
  recommendations: {
    optimization_recommendations: string[];
    expansion_opportunities: string[];
    risk_mitigations: string[];
    success_celebration_points: string[];
  };

  methodology_note: string;
}

// ============================================
// Tool Definition
// ============================================

export const CALCULATE_REALIZED_VALUE_TOOL = {
  name: "calculate_realized_value",
  description:
    "Calculates and tracks the actual value realized from AI implementations compared to projected business case. Provides comprehensive ROI analysis, value breakdown, and executive-ready metrics.",
  inputSchema: {
    type: "object",
    properties: {
      project_name: { type: "string", description: "Name of the project" },
      client_name: { type: "string", description: "Client company name" },
      industry: {
        type: "string",
        enum: ["manufacturing", "insurance", "aquaculture", "healthcare", "general"],
      },
      implementation_info: { type: "object", description: "Implementation details and costs" },
      projected_values: { type: "object", description: "Original projected values from business case" },
      actual_values: { type: "object", description: "Actual measured values" },
      intangible_benefits: { type: "object", description: "Qualitative benefits assessment" },
      challenges: { type: "object", description: "Implementation challenges" },
      future_context: { type: "object", description: "Future expansion context" },
    },
    required: [
      "project_name",
      "client_name",
      "industry",
      "implementation_info",
      "projected_values",
      "actual_values",
    ],
  },
};

// ============================================
// Implementation Helpers
// ============================================

function calculateMonthsSinceGoLive(goLiveDate: string, measurementDate: string): number {
  const goLive = new Date(goLiveDate);
  const measurement = new Date(measurementDate);
  const monthsDiff = (measurement.getFullYear() - goLive.getFullYear()) * 12 +
    (measurement.getMonth() - goLive.getMonth());
  return Math.max(1, monthsDiff);
}

function calculateValueBreakdown(
  actual: CalculateRealizedValueInput["actual_values"],
  hourlyRate: number = 75
): RealizedValueCalculation["value_breakdown"] {
  // Cost savings
  const laborSavings = actual.labor_cost_savings_monthly_usd;
  const efficiencySavings = actual.process_efficiency_savings_monthly_usd;
  const errorSavings = actual.error_reduction_savings_monthly_usd;
  const complianceSavings = actual.compliance_savings_monthly_usd;
  const otherSavings = actual.other_cost_savings_monthly_usd;
  const totalMonthlySavings = laborSavings + efficiencySavings + errorSavings + complianceSavings + otherSavings;

  // Revenue impact
  const directRevenue = actual.revenue_increase_monthly_usd;
  const retentionValue = actual.customer_retention_value_monthly_usd;
  const newCapabilityRevenue = actual.new_capability_revenue_monthly_usd;
  const totalMonthlyRevenue = directRevenue + retentionValue + newCapabilityRevenue;

  // Productivity gains
  const hoursWeekly = actual.hours_saved_per_week;
  const hoursAnnually = hoursWeekly * 52;
  const productivityValue = hoursAnnually * hourlyRate;

  // Quality improvements
  const qualityValue = (actual.error_rate_reduction_percent / 100) * totalMonthlySavings * 0.2 * 12;

  return {
    cost_savings: {
      total_monthly_usd: totalMonthlySavings,
      labor_savings_usd: laborSavings,
      efficiency_savings_usd: efficiencySavings,
      error_reduction_savings_usd: errorSavings,
      compliance_savings_usd: complianceSavings,
      other_savings_usd: otherSavings,
      annualized_total_usd: totalMonthlySavings * 12,
    },
    revenue_impact: {
      total_monthly_usd: totalMonthlyRevenue,
      direct_revenue_increase_usd: directRevenue,
      retention_value_usd: retentionValue,
      new_capability_revenue_usd: newCapabilityRevenue,
      annualized_total_usd: totalMonthlyRevenue * 12,
    },
    productivity_gains: {
      hours_saved_weekly: hoursWeekly,
      hours_saved_annually: hoursAnnually,
      productivity_value_usd: productivityValue,
      throughput_improvement_percent: actual.throughput_increase_percent,
      cycle_time_improvement_percent: actual.cycle_time_reduction_percent,
    },
    quality_improvements: {
      error_reduction_percent: actual.error_rate_reduction_percent,
      quality_score_change: actual.quality_score_improvement,
      customer_satisfaction_change: actual.customer_satisfaction_improvement,
      quality_value_estimate_usd: Math.round(qualityValue),
    },
  };
}

function calculateProjectionComparison(
  projected: CalculateRealizedValueInput["projected_values"],
  breakdown: RealizedValueCalculation["value_breakdown"],
  _monthsSinceGoLive: number
): RealizedValueCalculation["projection_comparison"] {
  // Calculate actual annualized values
  const actualAnnualizedSavings = breakdown.cost_savings.annualized_total_usd +
    breakdown.productivity_gains.productivity_value_usd;
  const actualAnnualizedRevenue = breakdown.revenue_impact.annualized_total_usd;

  // Savings comparison
  const savingsVariance = actualAnnualizedSavings - projected.projected_annual_savings_usd;
  const savingsVariancePercent = projected.projected_annual_savings_usd > 0
    ? Math.round((savingsVariance / projected.projected_annual_savings_usd) * 100)
    : 0;

  let savingsStatus: "ahead" | "on_track" | "behind";
  if (savingsVariancePercent >= 10) {
    savingsStatus = "ahead";
  } else if (savingsVariancePercent >= -15) {
    savingsStatus = "on_track";
  } else {
    savingsStatus = "behind";
  }

  // Revenue comparison
  const revenueVariance = actualAnnualizedRevenue - projected.projected_annual_revenue_increase_usd;
  const revenueVariancePercent = projected.projected_annual_revenue_increase_usd > 0
    ? Math.round((revenueVariance / projected.projected_annual_revenue_increase_usd) * 100)
    : 0;

  let revenueStatus: "ahead" | "on_track" | "behind";
  if (revenueVariancePercent >= 10) {
    revenueStatus = "ahead";
  } else if (revenueVariancePercent >= -15) {
    revenueStatus = "on_track";
  } else {
    revenueStatus = "behind";
  }

  // Benefits achieved
  const benefitsAchieved = projected.key_projected_benefits.map((benefit) => {
    // Simple heuristic - would need actual tracking in production
    const achieved = savingsVariancePercent >= 0;
    return {
      benefit,
      status: achieved ? "achieved" as const : "partially_achieved" as const,
      notes: achieved
        ? "Benefit realized as projected or better"
        : "Benefit partially realized, continue monitoring",
    };
  });

  return {
    savings_vs_projected: {
      projected_annual_usd: projected.projected_annual_savings_usd,
      actual_annualized_usd: actualAnnualizedSavings,
      variance_usd: savingsVariance,
      variance_percent: savingsVariancePercent,
      status: savingsStatus,
    },
    revenue_vs_projected: {
      projected_annual_usd: projected.projected_annual_revenue_increase_usd,
      actual_annualized_usd: actualAnnualizedRevenue,
      variance_usd: revenueVariance,
      variance_percent: revenueVariancePercent,
      status: revenueStatus,
    },
    roi_comparison: {
      projected_roi_percent: projected.projected_roi_percent ?? null,
      actual_roi_percent: 0, // Calculated separately
      roi_variance: null,
    },
    benefits_achieved: benefitsAchieved,
  };
}

function calculateInvestmentAnalysis(
  implementation: CalculateRealizedValueInput["implementation_info"],
  totalMonthlyValue: number,
  monthsSinceGoLive: number
): RealizedValueCalculation["investment_analysis"] {
  const totalInvestment = implementation.implementation_cost_usd;
  const ongoingCostsToDate = implementation.ongoing_monthly_cost_usd * monthsSinceGoLive;
  const totalCostToDate = totalInvestment + ongoingCostsToDate;
  const totalValueGenerated = totalMonthlyValue * monthsSinceGoLive;
  const netValue = totalValueGenerated - totalCostToDate;
  const monthlyNetValue = totalMonthlyValue - implementation.ongoing_monthly_cost_usd;
  const costPerValueDollar = totalValueGenerated > 0
    ? Math.round((totalCostToDate / totalValueGenerated) * 100) / 100
    : 999;

  let efficiencyRating: "excellent" | "good" | "fair" | "poor";
  if (costPerValueDollar <= 0.3) {
    efficiencyRating = "excellent";
  } else if (costPerValueDollar <= 0.5) {
    efficiencyRating = "good";
  } else if (costPerValueDollar <= 0.8) {
    efficiencyRating = "fair";
  } else {
    efficiencyRating = "poor";
  }

  return {
    total_investment_usd: totalInvestment,
    ongoing_costs_to_date_usd: ongoingCostsToDate,
    total_cost_to_date_usd: totalCostToDate,
    total_value_generated_usd: totalValueGenerated,
    net_value_usd: netValue,
    monthly_net_value_usd: monthlyNetValue,
    cost_per_value_dollar: costPerValueDollar,
    investment_efficiency_rating: efficiencyRating,
  };
}

function assessIntangibleValue(
  intangible: CalculateRealizedValueInput["intangible_benefits"],
  annualizedValue: number
): RealizedValueCalculation["intangible_value"] {
  let score = 50; // Base score

  if (!intangible) {
    return {
      overall_intangible_score: score,
      strategic_value: "medium",
      employee_impact: "Not assessed",
      competitive_positioning: "Not assessed",
      risk_reduction_assessment: "Not assessed",
      future_option_value: "Not assessed",
      estimated_intangible_value_usd: Math.round(annualizedValue * 0.1),
    };
  }

  // Strategic capability
  const strategicScores = { transformational: 25, high: 20, moderate: 10, low: 0 };
  if (intangible.strategic_capability_value) {
    score += strategicScores[intangible.strategic_capability_value] || 0;
  }

  // Competitive advantage
  const competitiveScores = { significant: 15, moderate: 10, minimal: 5, none: 0 };
  if (intangible.competitive_advantage_impact) {
    score += competitiveScores[intangible.competitive_advantage_impact] || 0;
  }

  // Risk reduction
  const riskScores = { high: 10, moderate: 5, low: 2, none: 0 };
  if (intangible.risk_reduction_value) {
    score += riskScores[intangible.risk_reduction_value] || 0;
  }

  score = Math.min(100, score);

  const strategicValue = score >= 70 ? "high" : score >= 40 ? "medium" : "low";

  // Estimate intangible value as percentage of tangible
  const intangibleMultiplier = score >= 70 ? 0.3 : score >= 50 ? 0.2 : 0.1;
  const estimatedIntangibleValue = Math.round(annualizedValue * intangibleMultiplier);

  return {
    overall_intangible_score: score,
    strategic_value: strategicValue,
    employee_impact: intangible.employee_satisfaction_impact === "significant_positive"
      ? "Significant positive impact on employee satisfaction and retention"
      : intangible.employee_satisfaction_impact === "positive"
        ? "Positive impact on employee experience"
        : "Neutral or minimal employee impact",
    competitive_positioning: intangible.competitive_advantage_impact === "significant"
      ? "Creates significant competitive differentiation"
      : intangible.competitive_advantage_impact === "moderate"
        ? "Provides moderate competitive advantage"
        : "Limited competitive differentiation",
    risk_reduction_assessment: intangible.risk_reduction_value === "high"
      ? "Substantially reduces operational and compliance risks"
      : intangible.risk_reduction_value === "moderate"
        ? "Moderately reduces key risk areas"
        : "Minimal risk reduction impact",
    future_option_value: intangible.scalability_benefit === "high"
      ? "High future option value through scalability and expansion potential"
      : intangible.scalability_benefit === "moderate"
        ? "Moderate future expansion potential"
        : "Limited scalability benefits",
    estimated_intangible_value_usd: estimatedIntangibleValue,
  };
}

function assessChallenges(
  challenges: CalculateRealizedValueInput["challenges"],
  monthlyValue: number,
  monthsSinceGoLive: number
): RealizedValueCalculation["challenges_assessment"] {
  if (!challenges) {
    return {
      total_challenge_impact_usd: 0,
      implementation_delay_impact_usd: 0,
      scope_change_impact_usd: 0,
      unexpected_cost_impact_usd: 0,
      net_value_after_challenges_usd: monthlyValue * monthsSinceGoLive,
      lessons_learned: ["No significant challenges reported"],
    };
  }

  const delayImpact = challenges.implementation_delays_weeks * (monthlyValue / 4);
  const scopeImpact = challenges.scope_changes_count * 5000; // Estimate per scope change
  const unexpectedCosts = challenges.unexpected_costs_usd;
  const totalImpact = delayImpact + scopeImpact + unexpectedCosts;

  const netValueAfter = (monthlyValue * monthsSinceGoLive) - totalImpact;

  const lessons: string[] = [];
  if (challenges.implementation_delays_weeks > 0) {
    lessons.push(`Implementation delays of ${challenges.implementation_delays_weeks} weeks impacted time-to-value`);
  }
  if (challenges.scope_changes_count > 2) {
    lessons.push("Multiple scope changes suggest need for better upfront requirements definition");
  }
  if (challenges.unexpected_costs_usd > 0) {
    lessons.push("Unexpected costs indicate need for larger contingency budget in future projects");
  }
  if (challenges.adoption_challenges.length > 0) {
    lessons.push(`Adoption challenges (${challenges.adoption_challenges.join(", ")}) require enhanced change management`);
  }
  if (challenges.technical_issues_count > 3) {
    lessons.push("Technical issues suggest need for more thorough testing before go-live");
  }
  if (lessons.length === 0) {
    lessons.push("Project executed with minimal challenges - document best practices for replication");
  }

  return {
    total_challenge_impact_usd: Math.round(totalImpact),
    implementation_delay_impact_usd: Math.round(delayImpact),
    scope_change_impact_usd: Math.round(scopeImpact),
    unexpected_cost_impact_usd: unexpectedCosts,
    net_value_after_challenges_usd: Math.round(netValueAfter),
    lessons_learned: lessons,
  };
}

function calculateValueTrajectory(
  monthlyValue: number,
  totalInvestment: number,
  ongoingMonthlyCost: number,
  monthsSinceGoLive: number,
  goLiveDate: string
): RealizedValueCalculation["value_trajectory"] {
  const netMonthlyValue = monthlyValue - ongoingMonthlyCost;

  // Project future values with modest growth assumption (2% monthly)
  const growthRate = 1.02;
  let projected12Month = 0;
  let projected36Month = 0;

  for (let i = 0; i < 12; i++) {
    projected12Month += monthlyValue * Math.pow(growthRate, i);
  }
  for (let i = 0; i < 36; i++) {
    projected36Month += monthlyValue * Math.pow(growthRate, i);
  }

  // Calculate break-even
  const valueToDate = monthlyValue * monthsSinceGoLive;
  const costToDate = totalInvestment + (ongoingMonthlyCost * monthsSinceGoLive);
  let breakEvenDate: string | null = null;

  if (valueToDate >= costToDate) {
    breakEvenDate = "Already achieved";
  } else if (netMonthlyValue > 0) {
    const monthsToBreakEven = Math.ceil((totalInvestment - valueToDate + costToDate) / netMonthlyValue);
    const breakEvenDateObj = new Date(goLiveDate);
    breakEvenDateObj.setMonth(breakEvenDateObj.getMonth() + monthsSinceGoLive + monthsToBreakEven);
    breakEvenDate = breakEvenDateObj.toISOString().split("T")[0];
  }

  return {
    current_monthly_value_usd: monthlyValue,
    trend: "stable", // Would need historical data for actual trend
    projected_12_month_value_usd: Math.round(projected12Month),
    projected_36_month_value_usd: Math.round(projected36Month),
    break_even_date: breakEvenDate,
    value_acceleration_opportunities: [
      "Expand to additional user groups or departments",
      "Implement advanced features not yet utilized",
      "Automate additional manual touchpoints",
      "Integrate with complementary systems",
      "Apply learnings to adjacent use cases",
    ],
  };
}

function generateExecutiveMetrics(
  summary: RealizedValueCalculation["value_summary"],
  breakdown: RealizedValueCalculation["value_breakdown"],
  investment: RealizedValueCalculation["investment_analysis"]
): RealizedValueCalculation["executive_metrics"] {
  const roiFormatted = summary.roi_realized_percent >= 0
    ? `${summary.roi_realized_percent}%`
    : `(${Math.abs(summary.roi_realized_percent)}%)`;

  const savingsFormatted = summary.annualized_value_usd >= 1000000
    ? `$${(summary.annualized_value_usd / 1000000).toFixed(1)}M`
    : `$${Math.round(summary.annualized_value_usd / 1000)}K`;

  const efficiencyFormatted = breakdown.productivity_gains.hours_saved_annually > 0
    ? `${Math.round(breakdown.productivity_gains.hours_saved_annually).toLocaleString()} hours saved annually`
    : `${breakdown.productivity_gains.throughput_improvement_percent}% throughput increase`;

  const statusEmoji = summary.value_realization_status === "exceeding" ? "📈"
    : summary.value_realization_status === "on_track" ? "✅"
      : summary.value_realization_status === "below" ? "⚠️" : "🔴";

  return {
    headline_roi: roiFormatted,
    headline_savings: savingsFormatted,
    headline_efficiency: efficiencyFormatted,
    one_line_summary: `${statusEmoji} ${summary.value_realization_status === "exceeding" ? "Exceeding" : summary.value_realization_status === "on_track" ? "Meeting" : "Below"} projected value with ${savingsFormatted} annualized savings and ${roiFormatted} ROI`,
    board_ready_metrics: [
      {
        metric: "Return on Investment",
        value: roiFormatted,
        context: `${summary.payback_achieved ? "Payback achieved" : "On track for payback"}`,
      },
      {
        metric: "Annual Value Generated",
        value: savingsFormatted,
        context: `${summary.value_vs_projection_percent}% of projected value`,
      },
      {
        metric: "Net Value Created",
        value: `$${Math.round(investment.net_value_usd / 1000)}K`,
        context: "Total value minus total costs to date",
      },
      {
        metric: "Efficiency Gain",
        value: efficiencyFormatted,
        context: "Operational improvement",
      },
      {
        metric: "Investment Efficiency",
        value: `$${investment.cost_per_value_dollar.toFixed(2)} cost per $1 value`,
        context: `${investment.investment_efficiency_rating} efficiency rating`,
      },
    ],
  };
}

function generateRecommendations(
  summary: RealizedValueCalculation["value_summary"],
  comparison: RealizedValueCalculation["projection_comparison"],
  challenges: RealizedValueCalculation["challenges_assessment"],
  futureContext: CalculateRealizedValueInput["future_context"]
): RealizedValueCalculation["recommendations"] {
  const optimization: string[] = [];
  const expansion: string[] = [];
  const riskMitigation: string[] = [];
  const celebration: string[] = [];

  // Based on status
  if (summary.value_realization_status === "exceeding") {
    celebration.push("Value creation exceeding projections - excellent execution");
    expansion.push("Consider accelerating expansion plans given strong performance");
  } else if (summary.value_realization_status === "below" || summary.value_realization_status === "significantly_below") {
    optimization.push("Conduct value realization review to identify gaps");
    optimization.push("Increase adoption focus to drive more value");
    riskMitigation.push("Document and address factors limiting value creation");
  }

  // Based on comparison
  if (comparison.savings_vs_projected.status === "behind") {
    optimization.push("Review cost savings assumptions and identify additional opportunities");
  }
  if (comparison.revenue_vs_projected.status === "behind") {
    optimization.push("Explore revenue enhancement opportunities not yet realized");
  }

  // From challenges
  if (challenges.lessons_learned.length > 0 && challenges.total_challenge_impact_usd > 0) {
    riskMitigation.push("Apply lessons learned to ongoing optimization efforts");
  }

  // From future context
  if (futureContext) {
    if (futureContext.planned_expansions.length > 0) {
      expansion.push(...futureContext.planned_expansions.slice(0, 2).map((e) => `Execute planned expansion: ${e}`));
    }
    if (futureContext.additional_use_cases_identified > 0) {
      expansion.push(`Evaluate ${futureContext.additional_use_cases_identified} identified additional use cases`);
    }
    if (futureContext.optimization_opportunities.length > 0) {
      optimization.push(...futureContext.optimization_opportunities.slice(0, 2));
    }
  }

  // Default recommendations
  if (optimization.length === 0) {
    optimization.push("Continue monitoring value metrics and maintain current trajectory");
  }
  if (expansion.length === 0) {
    expansion.push("Identify adjacent use cases for solution expansion");
  }
  if (riskMitigation.length === 0) {
    riskMitigation.push("Maintain current risk management practices");
  }
  if (celebration.length === 0 && summary.roi_realized_percent > 0) {
    celebration.push("Positive ROI achieved - share success with stakeholders");
  }

  return {
    optimization_recommendations: optimization,
    expansion_opportunities: expansion,
    risk_mitigations: riskMitigation,
    success_celebration_points: celebration,
  };
}

// ============================================
// Main Export Function
// ============================================

export function calculateRealizedValue(
  input: CalculateRealizedValueInput
): RealizedValueCalculation {
  const {
    project_name,
    client_name,
    implementation_info,
    projected_values,
    actual_values,
    intangible_benefits,
    challenges,
    future_context,
  } = input;

  const monthsSinceGoLive = calculateMonthsSinceGoLive(
    implementation_info.go_live_date,
    implementation_info.measurement_date
  );

  // Calculate value breakdown
  const valueBreakdown = calculateValueBreakdown(actual_values);

  // Calculate total monthly value
  const totalMonthlyValue = valueBreakdown.cost_savings.total_monthly_usd +
    valueBreakdown.revenue_impact.total_monthly_usd +
    (valueBreakdown.productivity_gains.productivity_value_usd / 12);

  // Calculate annualized value
  const annualizedValue = totalMonthlyValue * 12;

  // Calculate projection comparison
  const projectionComparison = calculateProjectionComparison(projected_values, valueBreakdown, monthsSinceGoLive);

  // Calculate value vs projection
  const projectedTotal = projected_values.projected_annual_savings_usd + projected_values.projected_annual_revenue_increase_usd;
  const valueVsProjection = projectedTotal > 0
    ? Math.round((annualizedValue / projectedTotal) * 100)
    : 100;

  // Determine status
  let valueStatus: "exceeding" | "on_track" | "below" | "significantly_below";
  if (valueVsProjection >= 110) {
    valueStatus = "exceeding";
  } else if (valueVsProjection >= 80) {
    valueStatus = "on_track";
  } else if (valueVsProjection >= 50) {
    valueStatus = "below";
  } else {
    valueStatus = "significantly_below";
  }

  // Calculate investment analysis
  const investmentAnalysis = calculateInvestmentAnalysis(implementation_info, totalMonthlyValue, monthsSinceGoLive);

  // Calculate ROI
  const totalValueToDate = totalMonthlyValue * monthsSinceGoLive;
  const totalCostToDate = implementation_info.implementation_cost_usd +
    (implementation_info.ongoing_monthly_cost_usd * monthsSinceGoLive);
  const roiRealized = totalCostToDate > 0
    ? Math.round(((totalValueToDate - totalCostToDate) / totalCostToDate) * 100)
    : 0;

  // Check payback
  const paybackAchieved = totalValueToDate >= totalCostToDate;
  let paybackMonths: number | null = null;
  if (paybackAchieved) {
    // Estimate when payback occurred
    const monthlyNet = totalMonthlyValue - implementation_info.ongoing_monthly_cost_usd;
    if (monthlyNet > 0) {
      paybackMonths = Math.ceil(implementation_info.implementation_cost_usd / monthlyNet);
    }
  }

  // Update ROI comparison
  projectionComparison.roi_comparison.actual_roi_percent = roiRealized;
  if (projected_values.projected_roi_percent !== undefined) {
    projectionComparison.roi_comparison.roi_variance = roiRealized - projected_values.projected_roi_percent;
  }

  // Key value drivers
  const drivers: string[] = [];
  if (valueBreakdown.cost_savings.labor_savings_usd > 0) {
    drivers.push("Labor cost reduction");
  }
  if (valueBreakdown.cost_savings.efficiency_savings_usd > 0) {
    drivers.push("Process efficiency gains");
  }
  if (valueBreakdown.revenue_impact.total_monthly_usd > 0) {
    drivers.push("Revenue enhancement");
  }
  if (valueBreakdown.productivity_gains.hours_saved_weekly > 0) {
    drivers.push("Productivity improvement");
  }
  if (drivers.length === 0) {
    drivers.push("Multiple small improvements");
  }

  // Intangible value
  const intangibleValue = assessIntangibleValue(intangible_benefits, annualizedValue);

  // Challenges assessment
  const challengesAssessment = assessChallenges(challenges, totalMonthlyValue, monthsSinceGoLive);

  // Value trajectory
  const valueTrajectory = calculateValueTrajectory(
    totalMonthlyValue,
    implementation_info.implementation_cost_usd,
    implementation_info.ongoing_monthly_cost_usd,
    monthsSinceGoLive,
    implementation_info.go_live_date
  );

  // Build value summary
  const valueSummary: RealizedValueCalculation["value_summary"] = {
    total_realized_value_usd: Math.round(totalValueToDate),
    annualized_value_usd: Math.round(annualizedValue),
    value_vs_projection_percent: valueVsProjection,
    value_realization_status: valueStatus,
    key_value_drivers: drivers,
    roi_realized_percent: roiRealized,
    payback_achieved: paybackAchieved,
    payback_months_actual: paybackMonths,
  };

  // Executive metrics
  const executiveMetrics = generateExecutiveMetrics(valueSummary, valueBreakdown, investmentAnalysis);

  // Recommendations
  const recommendations = generateRecommendations(valueSummary, projectionComparison, challengesAssessment, future_context);

  return {
    project_name,
    client_name,
    calculation_date: new Date().toISOString().split("T")[0],
    measurement_period: {
      go_live_date: implementation_info.go_live_date,
      measurement_date: implementation_info.measurement_date,
      months_since_go_live: monthsSinceGoLive,
    },

    value_summary: valueSummary,

    value_breakdown: valueBreakdown,

    projection_comparison: projectionComparison,

    investment_analysis: investmentAnalysis,

    intangible_value: intangibleValue,

    challenges_assessment: challengesAssessment,

    value_trajectory: valueTrajectory,

    executive_metrics: executiveMetrics,

    recommendations,

    methodology_note:
      "Value calculation follows Good AI Client Success methodology, combining quantitative financial metrics with qualitative assessments. Annualized values are projected from current monthly performance. ROI and payback calculations include both direct and ongoing costs. Intangible value estimation uses industry benchmarks. Regular reassessment recommended as implementation matures.",
  };
}
