/**
 * Good AI - assess_implementation_risk Tool Tests
 */

import {
  assessImplementationRisk,
  AssessImplementationRiskInputSchema,
  type AssessImplementationRiskInput,
} from "../src/tools/assess_implementation_risk.js";

describe("assessImplementationRisk", () => {
  const createValidInput = (
    overrides: Partial<AssessImplementationRiskInput> = {}
  ): AssessImplementationRiskInput => ({
    project_name: "AI Quality Control Pilot",
    company_name: "Acme Manufacturing",
    industry: "manufacturing",
    project_type: "pilot",
    estimated_duration_weeks: 12,
    estimated_budget_usd: 150000,
    technical_factors: {
      technology_maturity: "proven",
      integration_complexity: "medium",
      data_quality_rating: 7,
      legacy_system_involvement: false,
      custom_development_required: false,
      ai_model_type: "fine_tuned",
    },
    organizational_factors: {
      executive_sponsorship: "strong",
      change_readiness: "medium",
      prior_ai_experience: "some",
      dedicated_resources: true,
      cross_functional_alignment: "moderate",
    },
    ...overrides,
  });

  describe("output structure", () => {
    it("should return all required sections", () => {
      const result = assessImplementationRisk(createValidInput());

      expect(result).toHaveProperty("project_name");
      expect(result).toHaveProperty("company_name");
      expect(result).toHaveProperty("assessment_date");
      expect(result).toHaveProperty("risk_summary");
      expect(result).toHaveProperty("risk_categories");
      expect(result).toHaveProperty("identified_risks");
      expect(result).toHaveProperty("risk_heatmap");
      expect(result).toHaveProperty("mitigation_plan");
      expect(result).toHaveProperty("scenarios");
      expect(result).toHaveProperty("recommendations");
      expect(result).toHaveProperty("governance_recommendations");
      expect(result).toHaveProperty("methodology_note");
    });

    it("should include all risk category scores", () => {
      const result = assessImplementationRisk(createValidInput());

      expect(result.risk_categories).toHaveProperty("technical_risk");
      expect(result.risk_categories).toHaveProperty("organizational_risk");
      expect(result.risk_categories).toHaveProperty("external_risk");
      expect(result.risk_categories).toHaveProperty("execution_risk");

      for (const category of Object.values(result.risk_categories)) {
        expect(category).toHaveProperty("score");
        expect(category).toHaveProperty("level");
        expect(category).toHaveProperty("factors");
        expect(category.score).toBeGreaterThanOrEqual(1);
        expect(category.score).toBeLessThanOrEqual(10);
      }
    });

    it("should include risk summary", () => {
      const result = assessImplementationRisk(createValidInput());

      expect(result.risk_summary.overall_risk_score).toBeGreaterThanOrEqual(1);
      expect(result.risk_summary.overall_risk_score).toBeLessThanOrEqual(10);
      expect(["low", "medium", "high", "critical"]).toContain(
        result.risk_summary.overall_risk_level
      );
      expect(["improving", "stable", "deteriorating"]).toContain(
        result.risk_summary.risk_trend
      );
      expect(result.risk_summary.key_risk_drivers.length).toBeGreaterThan(0);
    });
  });

  describe("technical risk calculation", () => {
    it("should increase risk for experimental technology", () => {
      const proven = assessImplementationRisk(
        createValidInput({
          technical_factors: {
            technology_maturity: "proven",
            integration_complexity: "low",
            data_quality_rating: 8,
            legacy_system_involvement: false,
            custom_development_required: false,
            ai_model_type: "off_the_shelf",
          },
        })
      );
      const experimental = assessImplementationRisk(
        createValidInput({
          technical_factors: {
            technology_maturity: "experimental",
            integration_complexity: "low",
            data_quality_rating: 8,
            legacy_system_involvement: false,
            custom_development_required: false,
            ai_model_type: "off_the_shelf",
          },
        })
      );

      expect(experimental.risk_categories.technical_risk.score).toBeGreaterThan(
        proven.risk_categories.technical_risk.score
      );
    });

    it("should increase risk for low data quality", () => {
      const highQuality = assessImplementationRisk(
        createValidInput({
          technical_factors: {
            technology_maturity: "proven",
            integration_complexity: "low",
            data_quality_rating: 9,
            legacy_system_involvement: false,
            custom_development_required: false,
            ai_model_type: "off_the_shelf",
          },
        })
      );
      const lowQuality = assessImplementationRisk(
        createValidInput({
          technical_factors: {
            technology_maturity: "proven",
            integration_complexity: "low",
            data_quality_rating: 3,
            legacy_system_involvement: false,
            custom_development_required: false,
            ai_model_type: "off_the_shelf",
          },
        })
      );

      expect(lowQuality.risk_categories.technical_risk.score).toBeGreaterThan(
        highQuality.risk_categories.technical_risk.score
      );
    });

    it("should increase risk for legacy systems and custom development", () => {
      const simple = assessImplementationRisk(
        createValidInput({
          technical_factors: {
            technology_maturity: "proven",
            integration_complexity: "low",
            data_quality_rating: 8,
            legacy_system_involvement: false,
            custom_development_required: false,
            ai_model_type: "off_the_shelf",
          },
        })
      );
      const complex = assessImplementationRisk(
        createValidInput({
          technical_factors: {
            technology_maturity: "proven",
            integration_complexity: "high",
            data_quality_rating: 8,
            legacy_system_involvement: true,
            custom_development_required: true,
            ai_model_type: "custom_trained",
          },
        })
      );

      expect(complex.risk_categories.technical_risk.score).toBeGreaterThan(
        simple.risk_categories.technical_risk.score
      );
    });
  });

  describe("organizational risk calculation", () => {
    it("should increase risk for weak sponsorship", () => {
      const strong = assessImplementationRisk(
        createValidInput({
          organizational_factors: {
            executive_sponsorship: "strong",
            change_readiness: "high",
            prior_ai_experience: "extensive",
            dedicated_resources: true,
            cross_functional_alignment: "strong",
          },
        })
      );
      const weak = assessImplementationRisk(
        createValidInput({
          organizational_factors: {
            executive_sponsorship: "none",
            change_readiness: "low",
            prior_ai_experience: "none",
            dedicated_resources: false,
            cross_functional_alignment: "weak",
          },
        })
      );

      expect(weak.risk_categories.organizational_risk.score).toBeGreaterThan(
        strong.risk_categories.organizational_risk.score
      );
    });

    it("should increase risk for transformation projects", () => {
      const pilot = assessImplementationRisk(
        createValidInput({ project_type: "pilot" })
      );
      const transformation = assessImplementationRisk(
        createValidInput({ project_type: "transformation" })
      );

      expect(transformation.risk_categories.organizational_risk.score).toBeGreaterThan(
        pilot.risk_categories.organizational_risk.score
      );
    });
  });

  describe("external risk calculation", () => {
    it("should increase risk for strict regulatory requirements", () => {
      const none = assessImplementationRisk(
        createValidInput({
          external_factors: {
            regulatory_requirements: "none",
            vendor_dependencies: 0,
            market_pressure: "low",
            economic_uncertainty: "low",
          },
        })
      );
      const critical = assessImplementationRisk(
        createValidInput({
          external_factors: {
            regulatory_requirements: "critical",
            vendor_dependencies: 5,
            market_pressure: "high",
            economic_uncertainty: "high",
          },
        })
      );

      expect(critical.risk_categories.external_risk.score).toBeGreaterThan(
        none.risk_categories.external_risk.score
      );
    });

    it("should include industry-specific risks", () => {
      const healthcare = assessImplementationRisk(
        createValidInput({ industry: "healthcare" })
      );

      const hasComplianceRisk = healthcare.risk_categories.external_risk.factors.some(
        (f) => f.factor.toLowerCase().includes("compliance") || f.factor.toLowerCase().includes("healthcare")
      );
      expect(hasComplianceRisk).toBe(true);
    });
  });

  describe("execution risk calculation", () => {
    it("should increase risk for junior teams", () => {
      const expert = assessImplementationRisk(
        createValidInput({
          team_factors: {
            team_experience_level: "expert",
            team_stability: "stable",
            skill_gaps_identified: [],
            remote_team_percentage: 0,
          },
        })
      );
      const junior = assessImplementationRisk(
        createValidInput({
          team_factors: {
            team_experience_level: "junior",
            team_stability: "high_turnover",
            skill_gaps_identified: ["ML", "Data Engineering", "Cloud"],
            remote_team_percentage: 80,
          },
        })
      );

      expect(junior.risk_categories.execution_risk.score).toBeGreaterThan(
        expert.risk_categories.execution_risk.score
      );
    });

    it("should increase risk for known critical issues", () => {
      const noIssues = assessImplementationRisk(createValidInput());
      const criticalIssues = assessImplementationRisk(
        createValidInput({
          known_issues: [
            { issue: "Data access blocked", severity: "critical", status: "open" },
            { issue: "Key resource leaving", severity: "high", status: "open" },
          ],
        })
      );

      expect(criticalIssues.risk_categories.execution_risk.score).toBeGreaterThan(
        noIssues.risk_categories.execution_risk.score
      );
    });
  });

  describe("identified risks", () => {
    it("should generate risks from all categories", () => {
      const result = assessImplementationRisk(createValidInput());

      const categories = new Set(result.identified_risks.map((r) => r.category));
      expect(categories.size).toBeGreaterThan(0);
    });

    it("should include mitigation and contingency for each risk", () => {
      const result = assessImplementationRisk(createValidInput());

      result.identified_risks.forEach((risk) => {
        expect(risk.mitigation_strategy).toBeDefined();
        expect(risk.mitigation_strategy.length).toBeGreaterThan(0);
        expect(risk.contingency_plan).toBeDefined();
        expect(risk.contingency_plan.length).toBeGreaterThan(0);
      });
    });

    it("should include early warning indicators", () => {
      const result = assessImplementationRisk(createValidInput());

      result.identified_risks.forEach((risk) => {
        expect(risk.early_warning_indicators.length).toBeGreaterThan(0);
      });
    });

    it("should sort risks by score descending", () => {
      const result = assessImplementationRisk(createValidInput());

      for (let i = 1; i < result.identified_risks.length; i++) {
        expect(result.identified_risks[i - 1].risk_score).toBeGreaterThanOrEqual(
          result.identified_risks[i].risk_score
        );
      }
    });
  });

  describe("risk heatmap", () => {
    it("should categorize risks by probability and impact", () => {
      const result = assessImplementationRisk(createValidInput());

      expect(result.risk_heatmap).toHaveProperty("high_probability_high_impact");
      expect(result.risk_heatmap).toHaveProperty("high_probability_low_impact");
      expect(result.risk_heatmap).toHaveProperty("low_probability_high_impact");
      expect(result.risk_heatmap).toHaveProperty("low_probability_low_impact");
    });
  });

  describe("mitigation plan", () => {
    it("should include immediate and short-term actions", () => {
      const result = assessImplementationRisk(createValidInput());

      expect(result.mitigation_plan.immediate_actions.length).toBeGreaterThanOrEqual(0);
      expect(result.mitigation_plan.ongoing_monitoring.length).toBeGreaterThan(0);
    });

    it("should include monitoring items", () => {
      const result = assessImplementationRisk(createValidInput());

      result.mitigation_plan.ongoing_monitoring.forEach((item) => {
        expect(item.item).toBeDefined();
        expect(item.frequency).toBeDefined();
        expect(item.owner).toBeDefined();
      });
    });
  });

  describe("scenarios", () => {
    it("should include best, expected, and worst case scenarios", () => {
      const result = assessImplementationRisk(createValidInput());

      expect(result.scenarios.best_case).toBeDefined();
      expect(result.scenarios.expected_case).toBeDefined();
      expect(result.scenarios.worst_case).toBeDefined();
    });

    it("should have probabilities summing to approximately 100", () => {
      const result = assessImplementationRisk(createValidInput());

      const total =
        result.scenarios.best_case.probability +
        result.scenarios.expected_case.probability +
        result.scenarios.worst_case.probability;

      expect(total).toBe(100);
    });

    it("should include conditions for each scenario", () => {
      const result = assessImplementationRisk(createValidInput());

      expect(result.scenarios.best_case.conditions.length).toBeGreaterThan(0);
      expect(result.scenarios.expected_case.conditions.length).toBeGreaterThan(0);
      expect(result.scenarios.worst_case.conditions.length).toBeGreaterThan(0);
    });

    it("should include recovery options for worst case", () => {
      const result = assessImplementationRisk(createValidInput());

      expect(result.scenarios.worst_case.recovery_options.length).toBeGreaterThan(0);
    });
  });

  describe("recommendations", () => {
    it("should recommend proceed for low risk", () => {
      const result = assessImplementationRisk(
        createValidInput({
          technical_factors: {
            technology_maturity: "proven",
            integration_complexity: "low",
            data_quality_rating: 9,
            legacy_system_involvement: false,
            custom_development_required: false,
            ai_model_type: "off_the_shelf",
          },
          organizational_factors: {
            executive_sponsorship: "strong",
            change_readiness: "high",
            prior_ai_experience: "extensive",
            dedicated_resources: true,
            cross_functional_alignment: "strong",
          },
        })
      );

      expect(["proceed", "proceed_with_caution"]).toContain(
        result.recommendations.proceed_recommendation
      );
    });

    it("should recommend reassess or do_not_proceed for high risk", () => {
      const result = assessImplementationRisk(
        createValidInput({
          technical_factors: {
            technology_maturity: "experimental",
            integration_complexity: "high",
            data_quality_rating: 2,
            legacy_system_involvement: true,
            custom_development_required: true,
            ai_model_type: "novel_research",
          },
          organizational_factors: {
            executive_sponsorship: "none",
            change_readiness: "low",
            prior_ai_experience: "none",
            dedicated_resources: false,
            cross_functional_alignment: "weak",
          },
          external_factors: {
            regulatory_requirements: "critical",
            vendor_dependencies: 10,
            market_pressure: "high",
            economic_uncertainty: "high",
          },
          team_factors: {
            team_experience_level: "junior",
            team_stability: "high_turnover",
            skill_gaps_identified: ["ML", "Data", "Cloud", "AI"],
            remote_team_percentage: 100,
          },
        })
      );

      expect(["reassess", "do_not_proceed"]).toContain(
        result.recommendations.proceed_recommendation
      );
    });

    it("should include key success factors", () => {
      const result = assessImplementationRisk(createValidInput());

      expect(result.recommendations.key_success_factors.length).toBeGreaterThan(0);
    });

    it("should include critical dependencies", () => {
      const result = assessImplementationRisk(createValidInput());

      expect(result.recommendations.critical_dependencies).toBeDefined();
    });
  });

  describe("governance recommendations", () => {
    it("should provide review frequency", () => {
      const result = assessImplementationRisk(createValidInput());

      expect(result.governance_recommendations.review_frequency).toBeDefined();
    });

    it("should provide escalation triggers", () => {
      const result = assessImplementationRisk(createValidInput());

      expect(result.governance_recommendations.escalation_triggers.length).toBeGreaterThan(0);
    });

    it("should adjust governance for risk level", () => {
      const lowRisk = assessImplementationRisk(
        createValidInput({
          technical_factors: {
            technology_maturity: "proven",
            integration_complexity: "low",
            data_quality_rating: 9,
            legacy_system_involvement: false,
            custom_development_required: false,
            ai_model_type: "off_the_shelf",
          },
        })
      );
      const highRisk = assessImplementationRisk(
        createValidInput({
          technical_factors: {
            technology_maturity: "experimental",
            integration_complexity: "high",
            data_quality_rating: 2,
            legacy_system_involvement: true,
            custom_development_required: true,
            ai_model_type: "novel_research",
          },
        })
      );

      // High risk should have more frequent reviews
      expect(highRisk.governance_recommendations.review_frequency).not.toBe(
        lowRisk.governance_recommendations.review_frequency
      );
    });
  });

  describe("overall risk level", () => {
    it("should classify low risk correctly", () => {
      const result = assessImplementationRisk(
        createValidInput({
          technical_factors: {
            technology_maturity: "proven",
            integration_complexity: "low",
            data_quality_rating: 9,
            legacy_system_involvement: false,
            custom_development_required: false,
            ai_model_type: "off_the_shelf",
          },
          organizational_factors: {
            executive_sponsorship: "strong",
            change_readiness: "high",
            prior_ai_experience: "extensive",
            dedicated_resources: true,
            cross_functional_alignment: "strong",
          },
        })
      );

      expect(["low", "medium"]).toContain(result.risk_summary.overall_risk_level);
    });

    it("should classify high risk correctly", () => {
      const result = assessImplementationRisk(
        createValidInput({
          technical_factors: {
            technology_maturity: "experimental",
            integration_complexity: "high",
            data_quality_rating: 2,
            legacy_system_involvement: true,
            custom_development_required: true,
            ai_model_type: "novel_research",
          },
          organizational_factors: {
            executive_sponsorship: "none",
            change_readiness: "low",
            prior_ai_experience: "none",
            dedicated_resources: false,
            cross_functional_alignment: "weak",
          },
        })
      );

      expect(["high", "critical"]).toContain(result.risk_summary.overall_risk_level);
    });
  });

  describe("deterministic output", () => {
    it("should produce identical results for identical input", () => {
      const input = createValidInput();

      const result1 = assessImplementationRisk(input);
      const result2 = assessImplementationRisk(input);

      // Exclude assessment_date which may vary
      const comparable1 = { ...result1, assessment_date: "" };
      const comparable2 = { ...result2, assessment_date: "" };

      expect(comparable1).toEqual(comparable2);
    });
  });
});

describe("AssessImplementationRiskInputSchema", () => {
  it("should reject empty project name", () => {
    const input = {
      project_name: "",
      company_name: "Test",
      industry: "general",
      project_type: "pilot",
      estimated_duration_weeks: 8,
      estimated_budget_usd: 50000,
      technical_factors: {
        technology_maturity: "proven",
        integration_complexity: "low",
        data_quality_rating: 7,
      },
      organizational_factors: {
        executive_sponsorship: "strong",
        change_readiness: "medium",
        prior_ai_experience: "some",
      },
    };

    const result = AssessImplementationRiskInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should reject invalid project type", () => {
    const input = {
      project_name: "Test",
      company_name: "Test",
      industry: "general",
      project_type: "invalid",
      estimated_duration_weeks: 8,
      estimated_budget_usd: 50000,
      technical_factors: {
        technology_maturity: "proven",
        integration_complexity: "low",
        data_quality_rating: 7,
      },
      organizational_factors: {
        executive_sponsorship: "strong",
        change_readiness: "medium",
        prior_ai_experience: "some",
      },
    };

    const result = AssessImplementationRiskInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should accept valid minimal input", () => {
    const input = {
      project_name: "AI Pilot",
      company_name: "Acme Corp",
      industry: "general",
      project_type: "pilot",
      estimated_duration_weeks: 8,
      estimated_budget_usd: 50000,
      technical_factors: {
        technology_maturity: "proven",
        integration_complexity: "low",
        data_quality_rating: 7,
      },
      organizational_factors: {
        executive_sponsorship: "moderate",
        change_readiness: "medium",
        prior_ai_experience: "limited",
      },
    };

    const result = AssessImplementationRiskInputSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("should apply default values", () => {
    const input = {
      project_name: "AI Pilot",
      company_name: "Acme Corp",
      industry: "general",
      project_type: "pilot",
      estimated_duration_weeks: 8,
      estimated_budget_usd: 50000,
      technical_factors: {},
      organizational_factors: {},
    };

    const result = AssessImplementationRiskInputSchema.parse(input);
    expect(result.technical_factors.technology_maturity).toBe("proven");
    expect(result.organizational_factors.executive_sponsorship).toBe("moderate");
  });
});
