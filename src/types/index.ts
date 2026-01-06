/**
 * Good AI Enterprise Assessment Types
 * "Leverage, not lore" — Tools that deliver immediate value
 */

// Industry types supported by the assessment
export type Industry = "manufacturing" | "insurance" | "aquaculture" | "healthcare" | "general";

// ============================================
// assess_ai_readiness Types
// ============================================

export interface DataInfrastructure {
  centralized_data: boolean;
  data_quality_score?: number; // 1-10
  manual_data_entry_percent: number; // 0-100
}

export interface CurrentSystems {
  erp: string | null;
  crm: string | null;
  legacy_systems_count: number;
}

export interface AssessAIReadinessInput {
  company_name: string;
  industry: Industry;
  employee_count: number;
  annual_revenue_usd?: number;
  data_infrastructure: DataInfrastructure;
  current_systems: CurrentSystems;
  previous_ai_attempts?: string[];
}

export interface DimensionScore {
  score: number;
  findings: string[];
}

export interface AssessmentDimensions {
  data_readiness: DimensionScore;
  technical_capability: DimensionScore;
  process_maturity: DimensionScore;
  organizational_readiness: DimensionScore;
}

export interface AssessAIReadinessOutput {
  overall_score: number; // 1-10
  dimensions: AssessmentDimensions;
  strengths: string[];
  gaps: string[];
  recommended_starting_point: string;
  estimated_time_to_value_weeks: number;
  red_flags: string[];
}

// ============================================
// identify_bottlenecks Types
// ============================================

export interface ProcessMetrics {
  cycle_time_hours?: number;
  error_rate_percent?: number;
  manual_steps_count?: number;
  cost_per_unit_usd?: number;
}

export interface IdentifyBottlenecksInput {
  process_description: string;
  metrics: ProcessMetrics;
  pain_points: string[];
  industry: Industry;
}

export interface Bottleneck {
  name: string;
  description: string;
  estimated_annual_cost_usd: number;
  ai_solution_fit_score: number; // 1-10
  recommended_ai_approach: string;
  complexity: "low" | "medium" | "high";
}

export interface IdentifyBottlenecksOutput {
  bottlenecks: Bottleneck[];
  total_estimated_waste_usd: number;
  highest_impact_opportunity: string;
  quick_wins: string[];
}

// ============================================
// generate_pilot_plan Types
// ============================================

export interface PilotConstraints {
  max_budget_usd?: number;
  max_duration_weeks?: number;
  required_stakeholder_approval?: boolean;
  technical_constraints?: string[];
}

export interface GeneratePilotPlanInput {
  selected_bottleneck: Bottleneck;
  constraints: PilotConstraints;
  company_context: {
    company_name: string;
    industry: Industry;
    employee_count: number;
  };
}

export interface PilotMilestone {
  week: number;
  deliverable: string;
  success_criteria: string;
}

export interface GeneratePilotPlanOutput {
  pilot_name: string;
  objective: string;
  approach: string;
  duration_weeks: number;
  estimated_cost_usd: number;
  milestones: PilotMilestone[];
  success_metrics: string[];
  risk_mitigation: string[];
  next_steps: string[];
  good_ai_methodology_notes: string;
}

// ============================================
// calculate_roi Types
// ============================================

export interface CurrentMetrics {
  process_cost_per_month_usd: number;
  error_rate_percent?: number;
  cycle_time_hours?: number;
  manual_fte_count?: number;
}

export interface CalculateROIInput {
  current_metrics: CurrentMetrics;
  target_improvement_percent: number; // e.g., 30 for 30% improvement
  implementation_cost_usd: number;
  ongoing_monthly_cost_usd?: number;
  time_horizon_months?: number; // default 24
}

export interface SensitivityScenario {
  scenario: "conservative" | "expected" | "optimistic";
  improvement_percent: number;
  roi_percent: number;
  payback_months: number;
}

export interface CalculateROIOutput {
  expected_roi_percent: number;
  payback_period_months: number;
  net_present_value_usd: number;
  monthly_savings_usd: number;
  annual_savings_usd: number;
  sensitivity_analysis: SensitivityScenario[];
  assumptions: string[];
  confidence_level: "low" | "medium" | "high";
}

// ============================================
// Industry Benchmark Types
// ============================================

export interface IndustryBenchmark {
  industry: Industry;
  typical_data_readiness_score: number;
  common_bottlenecks: string[];
  ai_adoption_rate_percent: number;
  average_time_to_value_weeks: number;
  typical_first_use_case: string;
}
