/**
 * Tests for calculate_realized_value tool
 */

import {
  calculateRealizedValue,
  CalculateRealizedValueInputSchema,
  CALCULATE_REALIZED_VALUE_TOOL,
  type CalculateRealizedValueInput,
  type RealizedValueCalculation,
} from "../src/tools/calculate_realized_value.js";

describe("calculate_realized_value tool", () => {
  // ==========================================
  // Test Fixtures
  // ==========================================

  const baseInput: CalculateRealizedValueInput = {
    project_name: "AI Process Automation",
    client_name: "Acme Corp",
    industry: "manufacturing",
    implementation_info: {
      go_live_date: "2024-01-01",
      measurement_date: "2024-07-01",
      solution_type: "process_automation",
      implementation_cost_usd: 200000,
      ongoing_monthly_cost_usd: 5000,
    },
    projected_values: {
      projected_annual_savings_usd: 300000,
      projected_annual_revenue_increase_usd: 50000,
      projected_roi_percent: 75,
      projected_payback_months: 8,
      key_projected_benefits: [
        "Labor cost reduction",
        "Error rate reduction",
        "Faster processing time",
      ],
    },
    actual_values: {
      labor_cost_savings_monthly_usd: 15000,
      process_efficiency_savings_monthly_usd: 8000,
      error_reduction_savings_monthly_usd: 3000,
      compliance_savings_monthly_usd: 1000,
      other_cost_savings_monthly_usd: 500,
      revenue_increase_monthly_usd: 4000,
      customer_retention_value_monthly_usd: 1000,
      new_capability_revenue_monthly_usd: 500,
      hours_saved_per_week: 40,
      throughput_increase_percent: 25,
      cycle_time_reduction_percent: 30,
      error_rate_reduction_percent: 50,
      quality_score_improvement: 15,
      customer_satisfaction_improvement: 10,
    },
  };

  const exceedingProjectionsInput: CalculateRealizedValueInput = {
    ...baseInput,
    actual_values: {
      ...baseInput.actual_values,
      labor_cost_savings_monthly_usd: 25000,
      process_efficiency_savings_monthly_usd: 15000,
      revenue_increase_monthly_usd: 10000,
      hours_saved_per_week: 80,
    },
  };

  const belowProjectionsInput: CalculateRealizedValueInput = {
    ...baseInput,
    actual_values: {
      labor_cost_savings_monthly_usd: 5000,
      process_efficiency_savings_monthly_usd: 2000,
      error_reduction_savings_monthly_usd: 500,
      compliance_savings_monthly_usd: 0,
      other_cost_savings_monthly_usd: 0,
      revenue_increase_monthly_usd: 1000,
      customer_retention_value_monthly_usd: 0,
      new_capability_revenue_monthly_usd: 0,
      hours_saved_per_week: 10,
      throughput_increase_percent: 5,
      cycle_time_reduction_percent: 10,
      error_rate_reduction_percent: 15,
      quality_score_improvement: 5,
      customer_satisfaction_improvement: 3,
    },
  };

  const withIntangiblesInput: CalculateRealizedValueInput = {
    ...baseInput,
    intangible_benefits: {
      employee_satisfaction_impact: "significant_positive",
      strategic_capability_value: "high",
      competitive_advantage_impact: "significant",
      risk_reduction_value: "high",
      scalability_benefit: "high",
      data_insights_value: "high",
    },
  };

  const withChallengesInput: CalculateRealizedValueInput = {
    ...baseInput,
    challenges: {
      implementation_delays_weeks: 4,
      scope_changes_count: 3,
      adoption_challenges: ["User resistance", "Training delays"],
      unexpected_costs_usd: 25000,
      technical_issues_count: 5,
    },
  };

  const withFutureContextInput: CalculateRealizedValueInput = {
    ...baseInput,
    future_context: {
      planned_expansions: ["Expand to European operations", "Add quality inspection module"],
      additional_use_cases_identified: 5,
      optimization_opportunities: ["Automate exception handling", "Integrate with ERP"],
    },
  };

  // ==========================================
  // Tool Definition Tests
  // ==========================================

  describe("Tool Definition", () => {
    it("should have correct tool name", () => {
      expect(CALCULATE_REALIZED_VALUE_TOOL.name).toBe("calculate_realized_value");
    });

    it("should have a description", () => {
      expect(CALCULATE_REALIZED_VALUE_TOOL.description).toBeDefined();
      expect(CALCULATE_REALIZED_VALUE_TOOL.description.length).toBeGreaterThan(50);
    });

    it("should define required input properties", () => {
      const required = CALCULATE_REALIZED_VALUE_TOOL.inputSchema.required;
      expect(required).toContain("project_name");
      expect(required).toContain("client_name");
      expect(required).toContain("industry");
      expect(required).toContain("implementation_info");
      expect(required).toContain("projected_values");
      expect(required).toContain("actual_values");
    });
  });

  // ==========================================
  // Input Validation Tests
  // ==========================================

  describe("Input Validation", () => {
    it("should accept valid input", () => {
      expect(() => CalculateRealizedValueInputSchema.parse(baseInput)).not.toThrow();
    });

    it("should reject empty project name", () => {
      expect(() =>
        CalculateRealizedValueInputSchema.parse({ ...baseInput, project_name: "" })
      ).toThrow();
    });

    it("should reject invalid industry", () => {
      expect(() =>
        CalculateRealizedValueInputSchema.parse({ ...baseInput, industry: "invalid" })
      ).toThrow();
    });

    it("should reject invalid date format", () => {
      expect(() =>
        CalculateRealizedValueInputSchema.parse({
          ...baseInput,
          implementation_info: { ...baseInput.implementation_info, go_live_date: "01-01-2024" },
        })
      ).toThrow();
    });

    it("should reject negative implementation cost", () => {
      expect(() =>
        CalculateRealizedValueInputSchema.parse({
          ...baseInput,
          implementation_info: { ...baseInput.implementation_info, implementation_cost_usd: -1000 },
        })
      ).toThrow();
    });

    it("should reject projected savings below 0", () => {
      expect(() =>
        CalculateRealizedValueInputSchema.parse({
          ...baseInput,
          projected_values: { ...baseInput.projected_values, projected_annual_savings_usd: -1 },
        })
      ).toThrow();
    });

    it("should accept all valid industries", () => {
      const industries = ["manufacturing", "insurance", "aquaculture", "healthcare", "general"];
      industries.forEach((industry) => {
        expect(() =>
          CalculateRealizedValueInputSchema.parse({ ...baseInput, industry })
        ).not.toThrow();
      });
    });

    it("should accept all valid solution types", () => {
      const types = ["process_automation", "predictive_analytics", "document_processing",
        "quality_control", "customer_service", "supply_chain", "general_ai"];
      types.forEach((solution_type) => {
        expect(() =>
          CalculateRealizedValueInputSchema.parse({
            ...baseInput,
            implementation_info: { ...baseInput.implementation_info, solution_type },
          })
        ).not.toThrow();
      });
    });
  });

  // ==========================================
  // Output Structure Tests
  // ==========================================

  describe("Output Structure", () => {
    let result: RealizedValueCalculation;

    beforeAll(() => {
      result = calculateRealizedValue(baseInput);
    });

    it("should include project and client info", () => {
      expect(result.project_name).toBe(baseInput.project_name);
      expect(result.client_name).toBe(baseInput.client_name);
    });

    it("should include calculation date", () => {
      expect(result.calculation_date).toBeDefined();
      expect(result.calculation_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("should include measurement period", () => {
      expect(result.measurement_period).toBeDefined();
      expect(result.measurement_period.go_live_date).toBe(baseInput.implementation_info.go_live_date);
      expect(result.measurement_period.measurement_date).toBe(baseInput.implementation_info.measurement_date);
      expect(result.measurement_period.months_since_go_live).toBeGreaterThan(0);
    });

    it("should include value summary", () => {
      expect(result.value_summary).toBeDefined();
      expect(result.value_summary.total_realized_value_usd).toBeGreaterThanOrEqual(0);
      expect(result.value_summary.annualized_value_usd).toBeGreaterThanOrEqual(0);
      expect(["exceeding", "on_track", "below", "significantly_below"]).toContain(result.value_summary.value_realization_status);
      expect(result.value_summary.key_value_drivers.length).toBeGreaterThan(0);
    });

    it("should include value breakdown", () => {
      expect(result.value_breakdown).toBeDefined();
      expect(result.value_breakdown.cost_savings).toBeDefined();
      expect(result.value_breakdown.revenue_impact).toBeDefined();
      expect(result.value_breakdown.productivity_gains).toBeDefined();
      expect(result.value_breakdown.quality_improvements).toBeDefined();
    });

    it("should include projection comparison", () => {
      expect(result.projection_comparison).toBeDefined();
      expect(result.projection_comparison.savings_vs_projected).toBeDefined();
      expect(result.projection_comparison.revenue_vs_projected).toBeDefined();
      expect(result.projection_comparison.roi_comparison).toBeDefined();
      expect(result.projection_comparison.benefits_achieved).toBeDefined();
    });

    it("should include investment analysis", () => {
      expect(result.investment_analysis).toBeDefined();
      expect(result.investment_analysis.total_investment_usd).toBeDefined();
      expect(result.investment_analysis.net_value_usd).toBeDefined();
      expect(["excellent", "good", "fair", "poor"]).toContain(result.investment_analysis.investment_efficiency_rating);
    });

    it("should include intangible value", () => {
      expect(result.intangible_value).toBeDefined();
      expect(result.intangible_value.overall_intangible_score).toBeGreaterThanOrEqual(0);
      expect(["high", "medium", "low"]).toContain(result.intangible_value.strategic_value);
    });

    it("should include challenges assessment", () => {
      expect(result.challenges_assessment).toBeDefined();
      expect(result.challenges_assessment.total_challenge_impact_usd).toBeGreaterThanOrEqual(0);
      expect(result.challenges_assessment.lessons_learned).toBeDefined();
    });

    it("should include value trajectory", () => {
      expect(result.value_trajectory).toBeDefined();
      expect(result.value_trajectory.current_monthly_value_usd).toBeGreaterThanOrEqual(0);
      expect(result.value_trajectory.projected_12_month_value_usd).toBeGreaterThanOrEqual(0);
    });

    it("should include executive metrics", () => {
      expect(result.executive_metrics).toBeDefined();
      expect(result.executive_metrics.headline_roi).toBeDefined();
      expect(result.executive_metrics.headline_savings).toBeDefined();
      expect(result.executive_metrics.one_line_summary).toBeDefined();
      expect(result.executive_metrics.board_ready_metrics.length).toBeGreaterThan(0);
    });

    it("should include recommendations", () => {
      expect(result.recommendations).toBeDefined();
      expect(result.recommendations.optimization_recommendations.length).toBeGreaterThan(0);
      expect(result.recommendations.expansion_opportunities.length).toBeGreaterThan(0);
    });

    it("should include methodology note", () => {
      expect(result.methodology_note).toBeDefined();
      expect(result.methodology_note.length).toBeGreaterThan(50);
    });
  });

  // ==========================================
  // Value Calculation Tests
  // ==========================================

  describe("Value Calculations", () => {
    it("should calculate total monthly cost savings", () => {
      const result = calculateRealizedValue(baseInput);
      // 15000 + 8000 + 3000 + 1000 + 500 = 27500
      expect(result.value_breakdown.cost_savings.total_monthly_usd).toBe(27500);
    });

    it("should calculate annualized savings", () => {
      const result = calculateRealizedValue(baseInput);
      // 27500 * 12 = 330000
      expect(result.value_breakdown.cost_savings.annualized_total_usd).toBe(330000);
    });

    it("should calculate total monthly revenue impact", () => {
      const result = calculateRealizedValue(baseInput);
      // 4000 + 1000 + 500 = 5500
      expect(result.value_breakdown.revenue_impact.total_monthly_usd).toBe(5500);
    });

    it("should calculate hours saved annually", () => {
      const result = calculateRealizedValue(baseInput);
      // 40 hours/week * 52 weeks = 2080
      expect(result.value_breakdown.productivity_gains.hours_saved_annually).toBe(2080);
    });

    it("should calculate productivity value", () => {
      const result = calculateRealizedValue(baseInput);
      // 2080 hours * $75/hour (default) = 156000
      expect(result.value_breakdown.productivity_gains.productivity_value_usd).toBe(156000);
    });
  });

  // ==========================================
  // Status Determination Tests
  // ==========================================

  describe("Value Realization Status", () => {
    it("should identify exceeding status for high performance", () => {
      const result = calculateRealizedValue(exceedingProjectionsInput);
      expect(result.value_summary.value_realization_status).toBe("exceeding");
      expect(result.value_summary.value_vs_projection_percent).toBeGreaterThan(110);
    });

    it("should identify on_track status for expected performance", () => {
      const result = calculateRealizedValue(baseInput);
      expect(["exceeding", "on_track"]).toContain(result.value_summary.value_realization_status);
    });

    it("should identify below status for underperformance", () => {
      const result = calculateRealizedValue(belowProjectionsInput);
      expect(["below", "significantly_below"]).toContain(result.value_summary.value_realization_status);
    });
  });

  // ==========================================
  // ROI Calculation Tests
  // ==========================================

  describe("ROI Calculations", () => {
    it("should calculate ROI realized percent", () => {
      const result = calculateRealizedValue(baseInput);
      expect(typeof result.value_summary.roi_realized_percent).toBe("number");
    });

    it("should compare ROI to projection", () => {
      const result = calculateRealizedValue(baseInput);
      expect(result.projection_comparison.roi_comparison.actual_roi_percent).toBeDefined();
      expect(result.projection_comparison.roi_comparison.projected_roi_percent).toBe(75);
    });

    it("should calculate ROI variance when projected ROI provided", () => {
      const result = calculateRealizedValue(baseInput);
      expect(result.projection_comparison.roi_comparison.roi_variance).not.toBeNull();
    });
  });

  // ==========================================
  // Payback Analysis Tests
  // ==========================================

  describe("Payback Analysis", () => {
    it("should determine if payback achieved", () => {
      const result = calculateRealizedValue(baseInput);
      expect(typeof result.value_summary.payback_achieved).toBe("boolean");
    });

    it("should provide break even date", () => {
      const result = calculateRealizedValue(baseInput);
      expect(result.value_trajectory.break_even_date).toBeDefined();
    });

    it("should show achieved when value exceeds cost", () => {
      const highValueInput: CalculateRealizedValueInput = {
        ...baseInput,
        implementation_info: {
          ...baseInput.implementation_info,
          implementation_cost_usd: 50000,
        },
      };
      const result = calculateRealizedValue(highValueInput);
      expect(result.value_summary.payback_achieved).toBe(true);
    });
  });

  // ==========================================
  // Investment Analysis Tests
  // ==========================================

  describe("Investment Analysis", () => {
    it("should calculate total investment", () => {
      const result = calculateRealizedValue(baseInput);
      expect(result.investment_analysis.total_investment_usd).toBe(200000);
    });

    it("should calculate ongoing costs to date", () => {
      const result = calculateRealizedValue(baseInput);
      // 6 months * $5000 = $30000
      expect(result.investment_analysis.ongoing_costs_to_date_usd).toBe(30000);
    });

    it("should calculate total cost to date", () => {
      const result = calculateRealizedValue(baseInput);
      // $200000 + $30000 = $230000
      expect(result.investment_analysis.total_cost_to_date_usd).toBe(230000);
    });

    it("should calculate net value", () => {
      const result = calculateRealizedValue(baseInput);
      expect(result.investment_analysis.net_value_usd).toBeDefined();
    });

    it("should calculate cost per value dollar", () => {
      const result = calculateRealizedValue(baseInput);
      expect(result.investment_analysis.cost_per_value_dollar).toBeGreaterThan(0);
    });

    it("should rate investment efficiency", () => {
      const result = calculateRealizedValue(baseInput);
      expect(["excellent", "good", "fair", "poor"]).toContain(result.investment_analysis.investment_efficiency_rating);
    });
  });

  // ==========================================
  // Intangible Value Tests
  // ==========================================

  describe("Intangible Value Assessment", () => {
    it("should calculate intangible score without intangibles input", () => {
      const result = calculateRealizedValue(baseInput);
      expect(result.intangible_value.overall_intangible_score).toBe(50); // Base score
    });

    it("should increase score with strong intangibles", () => {
      const result = calculateRealizedValue(withIntangiblesInput);
      expect(result.intangible_value.overall_intangible_score).toBeGreaterThan(50);
    });

    it("should estimate intangible value in dollars", () => {
      const result = calculateRealizedValue(withIntangiblesInput);
      expect(result.intangible_value.estimated_intangible_value_usd).toBeGreaterThan(0);
    });

    it("should assess strategic value", () => {
      const result = calculateRealizedValue(withIntangiblesInput);
      expect(result.intangible_value.strategic_value).toBe("high");
    });

    it("should provide employee impact assessment", () => {
      const result = calculateRealizedValue(withIntangiblesInput);
      expect(result.intangible_value.employee_impact.toLowerCase()).toContain("significant positive");
    });
  });

  // ==========================================
  // Challenges Assessment Tests
  // ==========================================

  describe("Challenges Assessment", () => {
    it("should calculate delay impact", () => {
      const result = calculateRealizedValue(withChallengesInput);
      expect(result.challenges_assessment.implementation_delay_impact_usd).toBeGreaterThan(0);
    });

    it("should calculate scope change impact", () => {
      const result = calculateRealizedValue(withChallengesInput);
      expect(result.challenges_assessment.scope_change_impact_usd).toBeGreaterThan(0);
    });

    it("should include unexpected costs", () => {
      const result = calculateRealizedValue(withChallengesInput);
      expect(result.challenges_assessment.unexpected_cost_impact_usd).toBe(25000);
    });

    it("should calculate total challenge impact", () => {
      const result = calculateRealizedValue(withChallengesInput);
      expect(result.challenges_assessment.total_challenge_impact_usd).toBeGreaterThan(25000);
    });

    it("should generate lessons learned", () => {
      const result = calculateRealizedValue(withChallengesInput);
      expect(result.challenges_assessment.lessons_learned.length).toBeGreaterThan(1);
    });

    it("should report no challenges when none exist", () => {
      const result = calculateRealizedValue(baseInput);
      expect(result.challenges_assessment.total_challenge_impact_usd).toBe(0);
    });
  });

  // ==========================================
  // Value Trajectory Tests
  // ==========================================

  describe("Value Trajectory", () => {
    it("should calculate current monthly value", () => {
      const result = calculateRealizedValue(baseInput);
      expect(result.value_trajectory.current_monthly_value_usd).toBeGreaterThan(0);
    });

    it("should project 12-month value", () => {
      const result = calculateRealizedValue(baseInput);
      expect(result.value_trajectory.projected_12_month_value_usd).toBeGreaterThan(0);
    });

    it("should project 36-month value", () => {
      const result = calculateRealizedValue(baseInput);
      expect(result.value_trajectory.projected_36_month_value_usd).toBeGreaterThan(
        result.value_trajectory.projected_12_month_value_usd
      );
    });

    it("should provide value acceleration opportunities", () => {
      const result = calculateRealizedValue(baseInput);
      expect(result.value_trajectory.value_acceleration_opportunities.length).toBeGreaterThan(0);
    });
  });

  // ==========================================
  // Executive Metrics Tests
  // ==========================================

  describe("Executive Metrics", () => {
    it("should format headline ROI", () => {
      const result = calculateRealizedValue(baseInput);
      expect(result.executive_metrics.headline_roi).toContain("%");
    });

    it("should format headline savings", () => {
      const result = calculateRealizedValue(baseInput);
      expect(result.executive_metrics.headline_savings).toContain("$");
    });

    it("should provide one-line summary", () => {
      const result = calculateRealizedValue(baseInput);
      expect(result.executive_metrics.one_line_summary.length).toBeGreaterThan(20);
    });

    it("should provide board-ready metrics", () => {
      const result = calculateRealizedValue(baseInput);
      expect(result.executive_metrics.board_ready_metrics.length).toBeGreaterThan(3);
      result.executive_metrics.board_ready_metrics.forEach((metric) => {
        expect(metric.metric).toBeDefined();
        expect(metric.value).toBeDefined();
        expect(metric.context).toBeDefined();
      });
    });
  });

  // ==========================================
  // Projection Comparison Tests
  // ==========================================

  describe("Projection Comparison", () => {
    it("should compare savings to projected", () => {
      const result = calculateRealizedValue(baseInput);
      expect(result.projection_comparison.savings_vs_projected.projected_annual_usd).toBe(300000);
      expect(result.projection_comparison.savings_vs_projected.actual_annualized_usd).toBeGreaterThan(0);
      expect(["ahead", "on_track", "behind"]).toContain(result.projection_comparison.savings_vs_projected.status);
    });

    it("should compare revenue to projected", () => {
      const result = calculateRealizedValue(baseInput);
      expect(result.projection_comparison.revenue_vs_projected.projected_annual_usd).toBe(50000);
    });

    it("should track benefits achieved", () => {
      const result = calculateRealizedValue(baseInput);
      expect(result.projection_comparison.benefits_achieved.length).toBe(3);
      result.projection_comparison.benefits_achieved.forEach((benefit) => {
        expect(["achieved", "partially_achieved", "not_achieved", "exceeded"]).toContain(benefit.status);
      });
    });
  });

  // ==========================================
  // Recommendations Tests
  // ==========================================

  describe("Recommendations Generation", () => {
    it("should provide optimization recommendations", () => {
      const result = calculateRealizedValue(baseInput);
      expect(result.recommendations.optimization_recommendations.length).toBeGreaterThan(0);
    });

    it("should provide expansion opportunities", () => {
      const result = calculateRealizedValue(baseInput);
      expect(result.recommendations.expansion_opportunities.length).toBeGreaterThan(0);
    });

    it("should use future context for recommendations", () => {
      const result = calculateRealizedValue(withFutureContextInput);
      const allRecs = [
        ...result.recommendations.optimization_recommendations,
        ...result.recommendations.expansion_opportunities,
      ].join(" ");
      // Should include some of the future context
      expect(
        allRecs.toLowerCase().includes("expand") ||
        allRecs.toLowerCase().includes("use case") ||
        allRecs.toLowerCase().includes("automate")
      ).toBe(true);
    });

    it("should provide success celebration points when ROI positive", () => {
      const result = calculateRealizedValue(baseInput);
      expect(result.recommendations.success_celebration_points.length).toBeGreaterThan(0);
    });
  });

  // ==========================================
  // Months Since Go-Live Tests
  // ==========================================

  describe("Measurement Period Calculation", () => {
    it("should calculate months since go-live correctly", () => {
      const result = calculateRealizedValue(baseInput);
      // From 2024-01-01 to 2024-07-01 = 6 months
      expect(result.measurement_period.months_since_go_live).toBe(6);
    });

    it("should handle minimum of 1 month", () => {
      const recentInput: CalculateRealizedValueInput = {
        ...baseInput,
        implementation_info: {
          ...baseInput.implementation_info,
          go_live_date: "2024-06-15",
          measurement_date: "2024-06-20",
        },
      };
      const result = calculateRealizedValue(recentInput);
      expect(result.measurement_period.months_since_go_live).toBeGreaterThanOrEqual(1);
    });
  });

  // ==========================================
  // Determinism Tests
  // ==========================================

  describe("Determinism", () => {
    it("should produce consistent results for same input", () => {
      const result1 = calculateRealizedValue(baseInput);
      const result2 = calculateRealizedValue(baseInput);

      expect(result1.value_summary.total_realized_value_usd).toBe(result2.value_summary.total_realized_value_usd);
      expect(result1.value_summary.roi_realized_percent).toBe(result2.value_summary.roi_realized_percent);
      expect(result1.investment_analysis.net_value_usd).toBe(result2.investment_analysis.net_value_usd);
    });

    it("should produce different results for different inputs", () => {
      const baseResult = calculateRealizedValue(baseInput);
      const lowResult = calculateRealizedValue(belowProjectionsInput);

      expect(baseResult.value_summary.total_realized_value_usd).not.toBe(lowResult.value_summary.total_realized_value_usd);
    });
  });

  // ==========================================
  // Edge Case Tests
  // ==========================================

  describe("Edge Cases", () => {
    it("should handle zero actual values", () => {
      const zeroInput: CalculateRealizedValueInput = {
        ...baseInput,
        actual_values: {
          labor_cost_savings_monthly_usd: 0,
          process_efficiency_savings_monthly_usd: 0,
          error_reduction_savings_monthly_usd: 0,
          compliance_savings_monthly_usd: 0,
          other_cost_savings_monthly_usd: 0,
          revenue_increase_monthly_usd: 0,
          customer_retention_value_monthly_usd: 0,
          new_capability_revenue_monthly_usd: 0,
          hours_saved_per_week: 0,
          throughput_increase_percent: 0,
          cycle_time_reduction_percent: 0,
          error_rate_reduction_percent: 0,
          quality_score_improvement: 0,
          customer_satisfaction_improvement: 0,
        },
      };
      expect(() => calculateRealizedValue(zeroInput)).not.toThrow();
      const result = calculateRealizedValue(zeroInput);
      expect(result.value_summary.total_realized_value_usd).toBe(0);
    });

    it("should handle zero projected values", () => {
      const zeroProjectedInput: CalculateRealizedValueInput = {
        ...baseInput,
        projected_values: {
          projected_annual_savings_usd: 0,
          projected_annual_revenue_increase_usd: 0,
          key_projected_benefits: [],
        },
      };
      expect(() => calculateRealizedValue(zeroProjectedInput)).not.toThrow();
    });

    it("should handle very large values", () => {
      const largeInput: CalculateRealizedValueInput = {
        ...baseInput,
        actual_values: {
          ...baseInput.actual_values,
          labor_cost_savings_monthly_usd: 1000000,
          revenue_increase_monthly_usd: 500000,
        },
      };
      expect(() => calculateRealizedValue(largeInput)).not.toThrow();
      const result = calculateRealizedValue(largeInput);
      expect(result.value_summary.annualized_value_usd).toBeGreaterThan(10000000);
    });

    it("should handle minimal input without optional fields", () => {
      const minimalInput: CalculateRealizedValueInput = {
        project_name: "Minimal Project",
        client_name: "Test Client",
        industry: "general",
        implementation_info: {
          go_live_date: "2024-01-01",
          measurement_date: "2024-06-01",
          solution_type: "general_ai",
          implementation_cost_usd: 100000,
          ongoing_monthly_cost_usd: 0,
        },
        projected_values: {
          projected_annual_savings_usd: 200000,
          projected_annual_revenue_increase_usd: 0,
          key_projected_benefits: [],
        },
        actual_values: {
          labor_cost_savings_monthly_usd: 10000,
          process_efficiency_savings_monthly_usd: 0,
          error_reduction_savings_monthly_usd: 0,
          compliance_savings_monthly_usd: 0,
          other_cost_savings_monthly_usd: 0,
          revenue_increase_monthly_usd: 0,
          customer_retention_value_monthly_usd: 0,
          new_capability_revenue_monthly_usd: 0,
          hours_saved_per_week: 0,
          throughput_increase_percent: 0,
          cycle_time_reduction_percent: 0,
          error_rate_reduction_percent: 0,
          quality_score_improvement: 0,
          customer_satisfaction_improvement: 0,
        },
      };
      expect(() => calculateRealizedValue(minimalInput)).not.toThrow();
    });
  });

  // ==========================================
  // Industry Variation Tests
  // ==========================================

  describe("Industry Variations", () => {
    it("should handle healthcare industry", () => {
      const healthcareInput = { ...baseInput, industry: "healthcare" as const };
      const result = calculateRealizedValue(healthcareInput);
      expect(result).toBeDefined();
    });

    it("should handle insurance industry", () => {
      const insuranceInput = { ...baseInput, industry: "insurance" as const };
      const result = calculateRealizedValue(insuranceInput);
      expect(result).toBeDefined();
    });

    it("should handle aquaculture industry", () => {
      const aquacultureInput = { ...baseInput, industry: "aquaculture" as const };
      const result = calculateRealizedValue(aquacultureInput);
      expect(result).toBeDefined();
    });
  });
});
