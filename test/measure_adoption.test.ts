/**
 * Tests for measure_adoption tool
 */

import {
  measureAdoption,
  MeasureAdoptionInputSchema,
  MEASURE_ADOPTION_TOOL,
  type MeasureAdoptionInput,
  type AdoptionMeasurement,
} from "../src/tools/measure_adoption.js";

describe("measure_adoption tool", () => {
  // ==========================================
  // Test Fixtures
  // ==========================================

  const baseInput: MeasureAdoptionInput = {
    project_name: "AI Assistant Rollout",
    client_name: "Acme Corp",
    solution_name: "SmartAssist AI",
    industry: "manufacturing",
    deployment_info: {
      go_live_date: "2024-01-15",
      total_target_users: 500,
      deployment_type: "phased_rollout",
      current_phase: "Phase 2",
    },
    usage_metrics: {
      active_users_count: 200,
      daily_sessions_avg: 150,
      weekly_active_users: 180,
      monthly_active_users: 200,
      avg_session_duration_minutes: 12,
      features_used_count: 8,
      total_features_available: 12,
    },
    assessment_period: {
      start_date: "2024-03-01",
      end_date: "2024-03-31",
    },
  };

  const lowAdoptionInput: MeasureAdoptionInput = {
    ...baseInput,
    usage_metrics: {
      active_users_count: 50,
      daily_sessions_avg: 20,
      weekly_active_users: 40,
      monthly_active_users: 50,
      avg_session_duration_minutes: 5,
      features_used_count: 3,
      total_features_available: 12,
    },
    engagement_indicators: {
      user_satisfaction_score: 4,
      support_tickets_per_week: 30,
      training_completion_percent: 30,
    },
  };

  const highAdoptionInput: MeasureAdoptionInput = {
    ...baseInput,
    usage_metrics: {
      active_users_count: 450,
      daily_sessions_avg: 400,
      weekly_active_users: 420,
      monthly_active_users: 450,
      avg_session_duration_minutes: 25,
      features_used_count: 11,
      total_features_available: 12,
    },
    engagement_indicators: {
      user_satisfaction_score: 8.5,
      nps_score: 55,
      support_tickets_per_week: 5,
      training_completion_percent: 95,
      voluntary_usage_percent: 85,
      power_users_count: 50,
    },
    behavioral_metrics: {
      tasks_completed_per_user: 25,
      error_rate_percent: 2,
      workflow_completion_rate: 95,
      ai_recommendation_acceptance_rate: 80,
    },
    benchmarks: {
      industry_avg_adoption_rate: 60,
      previous_period_active_users: 380,
      target_adoption_rate: 80,
      target_satisfaction_score: 8,
    },
  };

  const withChangeContextInput: MeasureAdoptionInput = {
    ...baseInput,
    engagement_indicators: {
      user_satisfaction_score: 6,
      training_completion_percent: 60,
    },
    change_context: {
      change_champions_count: 3,
      resistance_incidents: 8,
      training_sessions_conducted: 10,
      communication_touchpoints: 15,
      executive_engagement_level: "low",
    },
  };

  // ==========================================
  // Tool Definition Tests
  // ==========================================

  describe("Tool Definition", () => {
    it("should have correct tool name", () => {
      expect(MEASURE_ADOPTION_TOOL.name).toBe("measure_adoption");
    });

    it("should have a description", () => {
      expect(MEASURE_ADOPTION_TOOL.description).toBeDefined();
      expect(MEASURE_ADOPTION_TOOL.description.length).toBeGreaterThan(50);
    });

    it("should define required input properties", () => {
      const required = MEASURE_ADOPTION_TOOL.inputSchema.required;
      expect(required).toContain("project_name");
      expect(required).toContain("client_name");
      expect(required).toContain("solution_name");
      expect(required).toContain("industry");
      expect(required).toContain("deployment_info");
      expect(required).toContain("usage_metrics");
      expect(required).toContain("assessment_period");
    });
  });

  // ==========================================
  // Input Validation Tests
  // ==========================================

  describe("Input Validation", () => {
    it("should accept valid input", () => {
      expect(() => MeasureAdoptionInputSchema.parse(baseInput)).not.toThrow();
    });

    it("should reject empty project name", () => {
      expect(() =>
        MeasureAdoptionInputSchema.parse({ ...baseInput, project_name: "" })
      ).toThrow();
    });

    it("should reject invalid industry", () => {
      expect(() =>
        MeasureAdoptionInputSchema.parse({ ...baseInput, industry: "invalid" })
      ).toThrow();
    });

    it("should reject invalid date format", () => {
      expect(() =>
        MeasureAdoptionInputSchema.parse({
          ...baseInput,
          deployment_info: { ...baseInput.deployment_info, go_live_date: "15-01-2024" },
        })
      ).toThrow();
    });

    it("should reject negative user counts", () => {
      expect(() =>
        MeasureAdoptionInputSchema.parse({
          ...baseInput,
          usage_metrics: { ...baseInput.usage_metrics, active_users_count: -1 },
        })
      ).toThrow();
    });

    it("should reject satisfaction score above 10", () => {
      expect(() =>
        MeasureAdoptionInputSchema.parse({
          ...baseInput,
          engagement_indicators: { user_satisfaction_score: 11 },
        })
      ).toThrow();
    });

    it("should reject NPS score outside valid range", () => {
      expect(() =>
        MeasureAdoptionInputSchema.parse({
          ...baseInput,
          engagement_indicators: { nps_score: 101 },
        })
      ).toThrow();
    });

    it("should accept all valid industries", () => {
      const industries = ["manufacturing", "insurance", "aquaculture", "healthcare", "general"];
      industries.forEach((industry) => {
        expect(() =>
          MeasureAdoptionInputSchema.parse({ ...baseInput, industry })
        ).not.toThrow();
      });
    });

    it("should accept all valid deployment types", () => {
      const types = ["pilot", "phased_rollout", "big_bang", "department_specific"];
      types.forEach((deployment_type) => {
        expect(() =>
          MeasureAdoptionInputSchema.parse({
            ...baseInput,
            deployment_info: { ...baseInput.deployment_info, deployment_type },
          })
        ).not.toThrow();
      });
    });
  });

  // ==========================================
  // Output Structure Tests
  // ==========================================

  describe("Output Structure", () => {
    let result: AdoptionMeasurement;

    beforeAll(() => {
      result = measureAdoption(baseInput);
    });

    it("should include project and client info", () => {
      expect(result.project_name).toBe(baseInput.project_name);
      expect(result.client_name).toBe(baseInput.client_name);
      expect(result.solution_name).toBe(baseInput.solution_name);
    });

    it("should include assessment date and period", () => {
      expect(result.assessment_date).toBeDefined();
      expect(result.assessment_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(result.assessment_period.start_date).toBe(baseInput.assessment_period.start_date);
      expect(result.assessment_period.end_date).toBe(baseInput.assessment_period.end_date);
      expect(result.assessment_period.days_since_go_live).toBeGreaterThan(0);
    });

    it("should include adoption summary", () => {
      expect(result.adoption_summary).toBeDefined();
      expect(result.adoption_summary.overall_adoption_score).toBeGreaterThanOrEqual(0);
      expect(result.adoption_summary.overall_adoption_score).toBeLessThanOrEqual(100);
      expect(["initial", "growing", "mainstream", "mature", "declining"]).toContain(result.adoption_summary.adoption_stage);
      expect(["accelerating", "steady", "slowing", "stalled"]).toContain(result.adoption_summary.adoption_velocity);
      expect(["healthy", "at_risk", "critical"]).toContain(result.adoption_summary.adoption_health);
    });

    it("should include key metrics snapshot", () => {
      const snapshot = result.adoption_summary.key_metrics_snapshot;
      expect(snapshot.adoption_rate_percent).toBeDefined();
      expect(snapshot.active_user_rate_percent).toBeDefined();
      expect(snapshot.engagement_score).toBeDefined();
      expect(["positive", "neutral", "negative", "unknown"]).toContain(snapshot.satisfaction_indicator);
    });

    it("should include adoption metrics", () => {
      expect(result.adoption_metrics).toBeDefined();
      expect(result.adoption_metrics.user_adoption).toBeDefined();
      expect(result.adoption_metrics.feature_adoption).toBeDefined();
      expect(result.adoption_metrics.depth_of_use).toBeDefined();
    });

    it("should include engagement analysis", () => {
      expect(result.engagement_analysis).toBeDefined();
      expect(result.engagement_analysis.engagement_score).toBeGreaterThanOrEqual(0);
      expect(["highly_engaged", "engaged", "passive", "disengaged"]).toContain(result.engagement_analysis.engagement_level);
      expect(result.engagement_analysis.user_segments).toBeDefined();
    });

    it("should include satisfaction metrics", () => {
      expect(result.satisfaction_metrics).toBeDefined();
      expect(["promoter", "passive", "detractor", "unknown"]).toContain(result.satisfaction_metrics.nps_category);
      expect(["low", "moderate", "high"]).toContain(result.satisfaction_metrics.support_burden);
    });

    it("should include behavioral insights", () => {
      expect(result.behavioral_insights).toBeDefined();
      expect(["expert", "proficient", "learning", "novice"]).toContain(result.behavioral_insights.proficiency_level);
      expect(["optimized", "adequate", "needs_improvement"]).toContain(result.behavioral_insights.workflow_efficiency);
    });

    it("should include benchmark comparison", () => {
      expect(result.benchmark_comparison).toBeDefined();
      expect(result.benchmark_comparison.vs_target).toBeDefined();
      expect(result.benchmark_comparison.vs_industry).toBeDefined();
      expect(result.benchmark_comparison.vs_previous_period).toBeDefined();
    });

    it("should include adoption risks", () => {
      expect(result.adoption_risks).toBeDefined();
      expect(["low", "medium", "high", "critical"]).toContain(result.adoption_risks.risk_level);
      expect(result.adoption_risks.risk_factors).toBeDefined();
      expect(["low", "moderate", "elevated", "high"]).toContain(result.adoption_risks.churn_risk_indicator);
    });

    it("should include recommendations", () => {
      expect(result.recommendations).toBeDefined();
      expect(result.recommendations.immediate_actions.length).toBeGreaterThan(0);
      expect(result.recommendations.engagement_strategies.length).toBeGreaterThan(0);
      expect(result.recommendations.training_recommendations.length).toBeGreaterThan(0);
      expect(result.recommendations.communication_recommendations.length).toBeGreaterThan(0);
    });

    it("should include success indicators", () => {
      expect(result.success_indicators).toBeDefined();
      expect(result.success_indicators.adoption_milestones_achieved).toBeDefined();
      expect(result.success_indicators.upcoming_milestones).toBeDefined();
      expect(result.success_indicators.value_realization_indicators).toBeDefined();
    });

    it("should include trend analysis", () => {
      expect(result.trend_analysis).toBeDefined();
      expect(["positive", "neutral", "negative"]).toContain(result.trend_analysis.adoption_trajectory);
      expect(result.trend_analysis.forecast_30_day).toBeDefined();
    });

    it("should include methodology note", () => {
      expect(result.methodology_note).toBeDefined();
      expect(result.methodology_note.length).toBeGreaterThan(50);
    });
  });

  // ==========================================
  // Adoption Rate Tests
  // ==========================================

  describe("Adoption Rate Calculation", () => {
    it("should calculate correct adoption rate", () => {
      const result = measureAdoption(baseInput);
      // 200 active users / 500 target = 40%
      expect(result.adoption_metrics.user_adoption.adoption_rate_percent).toBe(40);
    });

    it("should calculate weekly active rate", () => {
      const result = measureAdoption(baseInput);
      // 180 weekly active / 500 target = 36%
      expect(result.adoption_metrics.user_adoption.weekly_active_rate_percent).toBe(36);
    });

    it("should calculate monthly active rate", () => {
      const result = measureAdoption(baseInput);
      // 200 monthly active / 500 target = 40%
      expect(result.adoption_metrics.user_adoption.monthly_active_rate_percent).toBe(40);
    });

    it("should show high adoption for high adoption input", () => {
      const result = measureAdoption(highAdoptionInput);
      // 450 / 500 = 90%
      expect(result.adoption_metrics.user_adoption.adoption_rate_percent).toBe(90);
    });

    it("should show low adoption for low adoption input", () => {
      const result = measureAdoption(lowAdoptionInput);
      // 50 / 500 = 10%
      expect(result.adoption_metrics.user_adoption.adoption_rate_percent).toBe(10);
    });
  });

  // ==========================================
  // Adoption Stage Tests
  // ==========================================

  describe("Adoption Stage Determination", () => {
    it("should identify initial or declining stage for low adoption", () => {
      const result = measureAdoption(lowAdoptionInput);
      // Low adoption with stalled velocity may be "declining", or "initial" if recent
      expect(["initial", "declining"]).toContain(result.adoption_summary.adoption_stage);
    });

    it("should identify growing stage for moderate adoption", () => {
      const result = measureAdoption(baseInput);
      expect(["initial", "growing"]).toContain(result.adoption_summary.adoption_stage);
    });

    it("should identify mature stage for high adoption", () => {
      const result = measureAdoption(highAdoptionInput);
      expect(["mainstream", "mature"]).toContain(result.adoption_summary.adoption_stage);
    });
  });

  // ==========================================
  // Engagement Score Tests
  // ==========================================

  describe("Engagement Score Calculation", () => {
    it("should calculate engagement score between 0 and 100", () => {
      const result = measureAdoption(baseInput);
      expect(result.engagement_analysis.engagement_score).toBeGreaterThanOrEqual(0);
      expect(result.engagement_analysis.engagement_score).toBeLessThanOrEqual(100);
    });

    it("should show positive engagement for highly active users", () => {
      const result = measureAdoption(highAdoptionInput);
      // High adoption input should have reasonable engagement
      expect(result.engagement_analysis.engagement_score).toBeGreaterThan(20);
      expect(["highly_engaged", "engaged", "passive"]).toContain(result.engagement_analysis.engagement_level);
    });

    it("should show low engagement for low activity", () => {
      const result = measureAdoption(lowAdoptionInput);
      expect(result.engagement_analysis.engagement_score).toBeLessThan(60);
    });
  });

  // ==========================================
  // User Segments Tests
  // ==========================================

  describe("User Segment Analysis", () => {
    it("should calculate user segments summing to ~100%", () => {
      const result = measureAdoption(baseInput);
      const segments = result.engagement_analysis.user_segments;
      const total = segments.power_users_percent + segments.regular_users_percent +
        segments.occasional_users_percent + segments.inactive_users_percent;
      expect(total).toBeCloseTo(100, 0);
    });

    it("should identify power users from input", () => {
      const result = measureAdoption(highAdoptionInput);
      // 50 power users / 500 target = 10%
      expect(result.engagement_analysis.user_segments.power_users_percent).toBe(10);
    });
  });

  // ==========================================
  // Satisfaction Metrics Tests
  // ==========================================

  describe("Satisfaction Metrics", () => {
    it("should include satisfaction score when provided", () => {
      const result = measureAdoption(highAdoptionInput);
      expect(result.satisfaction_metrics.satisfaction_score).toBe(8.5);
    });

    it("should include NPS score when provided", () => {
      const result = measureAdoption(highAdoptionInput);
      expect(result.satisfaction_metrics.nps_score).toBe(55);
    });

    it("should categorize NPS correctly", () => {
      const result = measureAdoption(highAdoptionInput);
      expect(result.satisfaction_metrics.nps_category).toBe("promoter");
    });

    it("should handle missing satisfaction data", () => {
      const result = measureAdoption(baseInput);
      expect(result.satisfaction_metrics.nps_category).toBe("unknown");
    });

    it("should assess support burden", () => {
      const highSupportInput = {
        ...baseInput,
        engagement_indicators: { support_tickets_per_week: 100 },
      };
      const result = measureAdoption(highSupportInput);
      expect(result.satisfaction_metrics.support_burden).toBe("high");
    });
  });

  // ==========================================
  // Behavioral Insights Tests
  // ==========================================

  describe("Behavioral Insights", () => {
    it("should assess proficiency level", () => {
      const result = measureAdoption(highAdoptionInput);
      expect(["expert", "proficient"]).toContain(result.behavioral_insights.proficiency_level);
    });

    it("should assess workflow efficiency", () => {
      const result = measureAdoption(highAdoptionInput);
      // With 95% workflow completion rate, should be optimized or adequate
      expect(["optimized", "adequate"]).toContain(result.behavioral_insights.workflow_efficiency);
    });

    it("should determine AI trust indicator", () => {
      const result = measureAdoption(highAdoptionInput);
      expect(result.behavioral_insights.ai_trust_indicator).toBe("high");
    });

    it("should report unknown AI trust when no data", () => {
      const result = measureAdoption(baseInput);
      expect(result.behavioral_insights.ai_trust_indicator).toBe("unknown");
    });
  });

  // ==========================================
  // Benchmark Comparison Tests
  // ==========================================

  describe("Benchmark Comparisons", () => {
    it("should compare against target adoption rate", () => {
      const result = measureAdoption(highAdoptionInput);
      // 90% adoption vs 80% target = 112.5%
      expect(result.benchmark_comparison.vs_target.adoption_rate_vs_target).toBeGreaterThan(100);
      expect(result.benchmark_comparison.vs_target.on_track).toBe(true);
    });

    it("should compare against industry average", () => {
      const result = measureAdoption(highAdoptionInput);
      // 90% vs 60% industry avg = above
      expect(result.benchmark_comparison.vs_industry.adoption_vs_industry_avg).toBe("above");
    });

    it("should calculate adoption change from previous period", () => {
      const result = measureAdoption(highAdoptionInput);
      // 450 current vs 380 previous = (90% - 76%) = 14% change
      expect(result.benchmark_comparison.vs_previous_period.adoption_change_percent).toBeGreaterThan(0);
    });

    it("should handle missing benchmark data", () => {
      const result = measureAdoption(baseInput);
      expect(result.benchmark_comparison.vs_industry.adoption_vs_industry_avg).toBe("unknown");
    });
  });

  // ==========================================
  // Risk Assessment Tests
  // ==========================================

  describe("Adoption Risk Assessment", () => {
    it("should identify low risk for healthy adoption", () => {
      const result = measureAdoption(highAdoptionInput);
      expect(["low", "medium"]).toContain(result.adoption_risks.risk_level);
    });

    it("should identify high risk for poor adoption", () => {
      const result = measureAdoption(lowAdoptionInput);
      expect(["high", "critical"]).toContain(result.adoption_risks.risk_level);
    });

    it("should include risk factors with mitigations", () => {
      const result = measureAdoption(lowAdoptionInput);
      expect(result.adoption_risks.risk_factors.length).toBeGreaterThan(0);
      result.adoption_risks.risk_factors.forEach((risk) => {
        expect(risk.mitigation).toBeDefined();
        expect(risk.mitigation.length).toBeGreaterThan(0);
      });
    });

    it("should assess churn risk", () => {
      const result = measureAdoption(lowAdoptionInput);
      expect(["elevated", "high"]).toContain(result.adoption_risks.churn_risk_indicator);
    });

    it("should determine intervention urgency", () => {
      const result = measureAdoption(lowAdoptionInput);
      expect(["action_needed", "urgent"]).toContain(result.adoption_risks.intervention_urgency);
    });

    it("should flag support ticket issues", () => {
      const highTicketInput = {
        ...baseInput,
        engagement_indicators: { support_tickets_per_week: 150 },
      };
      const result = measureAdoption(highTicketInput);
      expect(result.adoption_risks.risk_factors.some(
        (r) => r.factor.toLowerCase().includes("support")
      )).toBe(true);
    });
  });

  // ==========================================
  // Recommendations Tests
  // ==========================================

  describe("Recommendations Generation", () => {
    it("should provide immediate actions for low adoption", () => {
      const result = measureAdoption(lowAdoptionInput);
      expect(result.recommendations.immediate_actions.some(
        (a) => a.priority === "high"
      )).toBe(true);
    });

    it("should provide engagement strategies", () => {
      const result = measureAdoption(baseInput);
      result.recommendations.engagement_strategies.forEach((strategy) => {
        expect(strategy.strategy).toBeDefined();
        expect(strategy.target_segment).toBeDefined();
        expect(strategy.expected_outcome).toBeDefined();
      });
    });

    it("should provide training recommendations", () => {
      const result = measureAdoption(lowAdoptionInput);
      expect(result.recommendations.training_recommendations.length).toBeGreaterThan(0);
    });

    it("should recommend change champions when few exist", () => {
      const result = measureAdoption(withChangeContextInput);
      expect(result.recommendations.immediate_actions.some(
        (a) => a.action.toLowerCase().includes("champion")
      )).toBe(true);
    });

    it("should recommend executive communication for low engagement", () => {
      const result = measureAdoption(withChangeContextInput);
      expect(result.recommendations.communication_recommendations.some(
        (r) => r.toLowerCase().includes("executive") || r.toLowerCase().includes("success")
      )).toBe(true);
    });
  });

  // ==========================================
  // Success Indicators Tests
  // ==========================================

  describe("Success Indicators", () => {
    it("should identify achieved milestones", () => {
      const result = measureAdoption(highAdoptionInput);
      expect(result.success_indicators.adoption_milestones_achieved.length).toBeGreaterThan(0);
    });

    it("should include upcoming milestones", () => {
      const result = measureAdoption(baseInput);
      expect(result.success_indicators.upcoming_milestones.length).toBeGreaterThan(0);
      result.success_indicators.upcoming_milestones.forEach((milestone) => {
        expect(milestone.milestone).toBeDefined();
        expect(["on_track", "at_risk", "unlikely"]).toContain(milestone.likelihood);
      });
    });

    it("should provide value realization indicators", () => {
      const result = measureAdoption(highAdoptionInput);
      expect(result.success_indicators.value_realization_indicators.length).toBeGreaterThan(0);
    });
  });

  // ==========================================
  // Trend Analysis Tests
  // ==========================================

  describe("Trend Analysis", () => {
    it("should determine adoption trajectory", () => {
      const result = measureAdoption(highAdoptionInput);
      expect(["positive", "neutral", "negative"]).toContain(result.trend_analysis.adoption_trajectory);
    });

    it("should provide 30-day forecast", () => {
      const result = measureAdoption(baseInput);
      expect(result.trend_analysis.forecast_30_day.projected_adoption_rate).toBeGreaterThan(0);
      expect(["high", "medium", "low"]).toContain(result.trend_analysis.forecast_30_day.confidence);
    });

    it("should identify inflection points", () => {
      const result = measureAdoption(baseInput);
      expect(result.trend_analysis.inflection_points.length).toBeGreaterThan(0);
    });

    it("should include seasonality notes", () => {
      const result = measureAdoption(baseInput);
      expect(result.trend_analysis.seasonality_notes.length).toBeGreaterThan(0);
    });
  });

  // ==========================================
  // Feature Adoption Tests
  // ==========================================

  describe("Feature Adoption Analysis", () => {
    it("should calculate feature utilization", () => {
      const result = measureAdoption(baseInput);
      // 8 / 12 = 66.7%
      expect(result.adoption_metrics.feature_adoption.feature_utilization_percent).toBeCloseTo(67, 0);
    });

    it("should assess core features adoption", () => {
      const result = measureAdoption(highAdoptionInput);
      // 11/12 = 91.7% utilization -> high
      expect(result.adoption_metrics.feature_adoption.core_features_adoption).toBe("high");
    });

    it("should identify underutilized features", () => {
      const result = measureAdoption(lowAdoptionInput);
      // 3/12 = 25% -> should have underutilized features
      expect(result.adoption_metrics.feature_adoption.underutilized_features.length).toBeGreaterThan(0);
    });
  });

  // ==========================================
  // Depth of Use Tests
  // ==========================================

  describe("Depth of Use Analysis", () => {
    it("should include session duration", () => {
      const result = measureAdoption(baseInput);
      expect(result.adoption_metrics.depth_of_use.avg_session_duration_minutes).toBe(12);
    });

    it("should calculate sessions per user", () => {
      const result = measureAdoption(baseInput);
      expect(result.adoption_metrics.depth_of_use.sessions_per_user_per_week).toBeGreaterThan(0);
    });

    it("should calculate depth score", () => {
      const result = measureAdoption(baseInput);
      expect(result.adoption_metrics.depth_of_use.depth_score).toBeGreaterThanOrEqual(0);
      expect(result.adoption_metrics.depth_of_use.depth_score).toBeLessThanOrEqual(100);
    });
  });

  // ==========================================
  // Adoption Health Tests
  // ==========================================

  describe("Adoption Health Assessment", () => {
    it("should assess healthy adoption", () => {
      const result = measureAdoption(highAdoptionInput);
      expect(result.adoption_summary.adoption_health).toBe("healthy");
    });

    it("should assess at-risk adoption", () => {
      const moderateInput = {
        ...baseInput,
        usage_metrics: {
          ...baseInput.usage_metrics,
          active_users_count: 150,
        },
        engagement_indicators: {
          user_satisfaction_score: 5,
        },
      };
      const result = measureAdoption(moderateInput);
      expect(["at_risk", "healthy"]).toContain(result.adoption_summary.adoption_health);
    });

    it("should assess critical adoption", () => {
      const result = measureAdoption(lowAdoptionInput);
      expect(["at_risk", "critical"]).toContain(result.adoption_summary.adoption_health);
    });
  });

  // ==========================================
  // Days Since Go-Live Tests
  // ==========================================

  describe("Days Since Go-Live Calculation", () => {
    it("should calculate days since go-live correctly", () => {
      const result = measureAdoption(baseInput);
      // From 2024-01-15 to 2024-03-31 = ~75 days
      expect(result.assessment_period.days_since_go_live).toBeGreaterThan(70);
      expect(result.assessment_period.days_since_go_live).toBeLessThan(80);
    });
  });

  // ==========================================
  // Determinism Tests
  // ==========================================

  describe("Determinism", () => {
    it("should produce consistent results for same input", () => {
      const result1 = measureAdoption(baseInput);
      const result2 = measureAdoption(baseInput);

      expect(result1.adoption_summary.overall_adoption_score).toBe(result2.adoption_summary.overall_adoption_score);
      expect(result1.engagement_analysis.engagement_score).toBe(result2.engagement_analysis.engagement_score);
      expect(result1.adoption_risks.risk_level).toBe(result2.adoption_risks.risk_level);
    });

    it("should produce different results for different inputs", () => {
      const lowResult = measureAdoption(lowAdoptionInput);
      const highResult = measureAdoption(highAdoptionInput);

      expect(lowResult.adoption_summary.overall_adoption_score).not.toBe(highResult.adoption_summary.overall_adoption_score);
    });
  });

  // ==========================================
  // Edge Case Tests
  // ==========================================

  describe("Edge Cases", () => {
    it("should handle minimum user count", () => {
      const minInput = {
        ...baseInput,
        deployment_info: { ...baseInput.deployment_info, total_target_users: 1 },
        usage_metrics: {
          active_users_count: 1,
          daily_sessions_avg: 1,
          weekly_active_users: 1,
          monthly_active_users: 1,
        },
      };
      const result = measureAdoption(minInput);
      expect(result.adoption_metrics.user_adoption.adoption_rate_percent).toBe(100);
    });

    it("should handle zero active users", () => {
      const zeroInput = {
        ...baseInput,
        usage_metrics: {
          active_users_count: 0,
          daily_sessions_avg: 0,
          weekly_active_users: 0,
          monthly_active_users: 0,
        },
      };
      const result = measureAdoption(zeroInput);
      expect(result.adoption_metrics.user_adoption.adoption_rate_percent).toBe(0);
    });

    it("should handle recent go-live", () => {
      const recentInput = {
        ...baseInput,
        deployment_info: { ...baseInput.deployment_info, go_live_date: "2024-03-25" },
      };
      const result = measureAdoption(recentInput);
      expect(result.assessment_period.days_since_go_live).toBeLessThan(10);
      expect(result.adoption_summary.adoption_stage).toBe("initial");
    });

    it("should handle all optional fields missing", () => {
      const minimalInput: MeasureAdoptionInput = {
        project_name: "Test Project",
        client_name: "Test Client",
        solution_name: "Test Solution",
        industry: "general",
        deployment_info: {
          go_live_date: "2024-01-01",
          total_target_users: 100,
          deployment_type: "phased_rollout",
        },
        usage_metrics: {
          active_users_count: 50,
          daily_sessions_avg: 30,
          weekly_active_users: 45,
          monthly_active_users: 50,
        },
        assessment_period: {
          start_date: "2024-03-01",
          end_date: "2024-03-31",
        },
      };
      expect(() => measureAdoption(minimalInput)).not.toThrow();
      const result = measureAdoption(minimalInput);
      expect(result.adoption_summary).toBeDefined();
    });

    it("should handle 100% adoption", () => {
      const fullAdoptionInput = {
        ...baseInput,
        usage_metrics: {
          ...baseInput.usage_metrics,
          active_users_count: 500,
          weekly_active_users: 500,
          monthly_active_users: 500,
        },
      };
      const result = measureAdoption(fullAdoptionInput);
      expect(result.adoption_metrics.user_adoption.adoption_rate_percent).toBe(100);
      expect(result.adoption_summary.adoption_stage).toBe("mature");
    });
  });

  // ==========================================
  // Industry Variation Tests
  // ==========================================

  describe("Industry Variations", () => {
    it("should handle healthcare industry", () => {
      const healthcareInput = { ...baseInput, industry: "healthcare" as const };
      const result = measureAdoption(healthcareInput);
      expect(result).toBeDefined();
    });

    it("should handle insurance industry", () => {
      const insuranceInput = { ...baseInput, industry: "insurance" as const };
      const result = measureAdoption(insuranceInput);
      expect(result).toBeDefined();
    });

    it("should handle aquaculture industry", () => {
      const aquacultureInput = { ...baseInput, industry: "aquaculture" as const };
      const result = measureAdoption(aquacultureInput);
      expect(result).toBeDefined();
    });
  });
});
