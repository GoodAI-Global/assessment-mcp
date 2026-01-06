/**
 * Good AI - estimate_deal_size Tool Tests
 */

import {
  estimateDealSize,
  EstimateDealSizeInputSchema,
  type EstimateDealSizeInput,
} from "../src/tools/estimate_deal_size.js";

describe("estimateDealSize", () => {
  const createValidInput = (
    overrides: Partial<EstimateDealSizeInput> = {}
  ): EstimateDealSizeInput => ({
    company_name: "Acme Manufacturing",
    industry: "manufacturing",
    employee_count: 500,
    annual_revenue_usd: 50000000,
    engagement_type: "implementation",
    scope_dimensions: {
      departments_involved: 2,
      locations_count: 1,
      integrations_required: 3,
      data_sources_count: 4,
      user_count: 50,
      custom_development_required: false,
    },
    complexity_factors: {
      regulatory_requirements: "standard",
      legacy_system_integration: false,
      multi_language_support: false,
      real_time_requirements: false,
      high_availability_sla: false,
    },
    timeline_preference: "standard",
    client_ai_maturity: "experimenting",
    existing_relationship: false,
    competitive_situation: "competitive",
    ...overrides,
  });

  describe("output structure", () => {
    it("should return all required fields", () => {
      const result = estimateDealSize(createValidInput());

      expect(result).toHaveProperty("company_name");
      expect(result).toHaveProperty("industry");
      expect(result).toHaveProperty("engagement_type");
      expect(result).toHaveProperty("estimate");
      expect(result).toHaveProperty("deal_structure");
      expect(result).toHaveProperty("pricing_factors");
      expect(result).toHaveProperty("margin_analysis");
      expect(result).toHaveProperty("competitive_positioning");
      expect(result).toHaveProperty("expansion_potential");
      expect(result).toHaveProperty("deal_risks");
      expect(result).toHaveProperty("negotiation_guidance");
      expect(result).toHaveProperty("recommendations");
      expect(result).toHaveProperty("methodology_note");
    });

    it("should include complete estimate breakdown", () => {
      const result = estimateDealSize(createValidInput());

      expect(result.estimate).toHaveProperty("base_value_usd");
      expect(result.estimate).toHaveProperty("complexity_adjustment_usd");
      expect(result.estimate).toHaveProperty("scope_adjustment_usd");
      expect(result.estimate).toHaveProperty("timeline_adjustment_usd");
      expect(result.estimate).toHaveProperty("total_estimated_value_usd");
      expect(result.estimate).toHaveProperty("value_range");
      expect(result.estimate).toHaveProperty("confidence");
    });

    it("should include value range with low/mid/high", () => {
      const result = estimateDealSize(createValidInput());

      expect(result.estimate.value_range).toHaveProperty("low_usd");
      expect(result.estimate.value_range).toHaveProperty("mid_usd");
      expect(result.estimate.value_range).toHaveProperty("high_usd");
      expect(result.estimate.value_range.low_usd).toBeLessThan(result.estimate.value_range.mid_usd);
      expect(result.estimate.value_range.mid_usd).toBeLessThan(
        result.estimate.value_range.high_usd
      );
    });
  });

  describe("engagement type pricing", () => {
    it("should increase price for larger engagement types", () => {
      const assessment = estimateDealSize(createValidInput({ engagement_type: "assessment" }));
      const pilot = estimateDealSize(createValidInput({ engagement_type: "pilot" }));
      const implementation = estimateDealSize(
        createValidInput({ engagement_type: "implementation" })
      );
      const transformation = estimateDealSize(
        createValidInput({ engagement_type: "transformation" })
      );

      expect(assessment.estimate.total_estimated_value_usd).toBeLessThan(
        pilot.estimate.total_estimated_value_usd
      );
      expect(pilot.estimate.total_estimated_value_usd).toBeLessThan(
        implementation.estimate.total_estimated_value_usd
      );
      expect(implementation.estimate.total_estimated_value_usd).toBeLessThan(
        transformation.estimate.total_estimated_value_usd
      );
    });

    it("should handle managed_service engagement type", () => {
      const result = estimateDealSize(createValidInput({ engagement_type: "managed_service" }));

      expect(result.estimate.total_estimated_value_usd).toBeGreaterThan(0);
      expect(result.deal_structure.payment_structure).toContain("recurring");
    });
  });

  describe("company size scaling", () => {
    it("should increase price for larger companies", () => {
      const small = estimateDealSize(createValidInput({ employee_count: 100 }));
      const medium = estimateDealSize(createValidInput({ employee_count: 500 }));
      const large = estimateDealSize(createValidInput({ employee_count: 5000 }));
      const enterprise = estimateDealSize(createValidInput({ employee_count: 10000 }));

      expect(small.estimate.base_value_usd).toBeLessThan(medium.estimate.base_value_usd);
      expect(medium.estimate.base_value_usd).toBeLessThan(large.estimate.base_value_usd);
      expect(large.estimate.base_value_usd).toBeLessThan(enterprise.estimate.base_value_usd);
    });
  });

  describe("industry multipliers", () => {
    it("should apply industry premiums", () => {
      const general = estimateDealSize(createValidInput({ industry: "general" }));
      const healthcare = estimateDealSize(createValidInput({ industry: "healthcare" }));

      expect(healthcare.estimate.base_value_usd).toBeGreaterThan(general.estimate.base_value_usd);
    });

    it("should document industry premium in pricing factors", () => {
      const result = estimateDealSize(createValidInput({ industry: "insurance" }));

      const industryFactor = result.pricing_factors.find((f) => f.factor === "Industry Premium");
      expect(industryFactor).toBeDefined();
      expect(industryFactor?.impact).toBe("increases");
    });
  });

  describe("complexity adjustments", () => {
    it("should increase price for regulatory requirements", () => {
      const none = estimateDealSize(
        createValidInput({
          complexity_factors: {
            regulatory_requirements: "none",
            legacy_system_integration: false,
            multi_language_support: false,
            real_time_requirements: false,
            high_availability_sla: false,
          },
        })
      );
      const critical = estimateDealSize(
        createValidInput({
          complexity_factors: {
            regulatory_requirements: "critical",
            legacy_system_integration: false,
            multi_language_support: false,
            real_time_requirements: false,
            high_availability_sla: false,
          },
        })
      );

      expect(critical.estimate.complexity_adjustment_usd).toBeGreaterThan(
        none.estimate.complexity_adjustment_usd
      );
    });

    it("should increase price for legacy integration", () => {
      const noLegacy = estimateDealSize(
        createValidInput({
          complexity_factors: {
            regulatory_requirements: "none",
            legacy_system_integration: false,
            multi_language_support: false,
            real_time_requirements: false,
            high_availability_sla: false,
          },
        })
      );
      const withLegacy = estimateDealSize(
        createValidInput({
          complexity_factors: {
            regulatory_requirements: "none",
            legacy_system_integration: true,
            multi_language_support: false,
            real_time_requirements: false,
            high_availability_sla: false,
          },
        })
      );

      expect(withLegacy.estimate.complexity_adjustment_usd).toBeGreaterThan(
        noLegacy.estimate.complexity_adjustment_usd
      );
    });

    it("should add pricing factors for each complexity item", () => {
      const result = estimateDealSize(
        createValidInput({
          complexity_factors: {
            regulatory_requirements: "strict",
            legacy_system_integration: true,
            multi_language_support: true,
            real_time_requirements: true,
            high_availability_sla: true,
          },
        })
      );

      expect(result.pricing_factors.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("scope adjustments", () => {
    it("should increase price for more integrations", () => {
      const fewIntegrations = estimateDealSize(
        createValidInput({
          scope_dimensions: {
            departments_involved: 1,
            locations_count: 1,
            integrations_required: 1,
            data_sources_count: 1,
            user_count: 10,
            custom_development_required: false,
          },
        })
      );
      const manyIntegrations = estimateDealSize(
        createValidInput({
          scope_dimensions: {
            departments_involved: 1,
            locations_count: 1,
            integrations_required: 10,
            data_sources_count: 1,
            user_count: 10,
            custom_development_required: false,
          },
        })
      );

      expect(manyIntegrations.estimate.scope_adjustment_usd).toBeGreaterThan(
        fewIntegrations.estimate.scope_adjustment_usd
      );
    });

    it("should increase price for more users", () => {
      const fewUsers = estimateDealSize(
        createValidInput({
          scope_dimensions: {
            departments_involved: 1,
            locations_count: 1,
            integrations_required: 0,
            data_sources_count: 1,
            user_count: 10,
            custom_development_required: false,
          },
        })
      );
      const manyUsers = estimateDealSize(
        createValidInput({
          scope_dimensions: {
            departments_involved: 1,
            locations_count: 1,
            integrations_required: 0,
            data_sources_count: 1,
            user_count: 1000,
            custom_development_required: false,
          },
        })
      );

      expect(manyUsers.estimate.scope_adjustment_usd).toBeGreaterThan(
        fewUsers.estimate.scope_adjustment_usd
      );
    });

    it("should increase price for custom development", () => {
      const standard = estimateDealSize(
        createValidInput({
          scope_dimensions: {
            departments_involved: 1,
            locations_count: 1,
            integrations_required: 0,
            data_sources_count: 1,
            user_count: 10,
            custom_development_required: false,
          },
        })
      );
      const custom = estimateDealSize(
        createValidInput({
          scope_dimensions: {
            departments_involved: 1,
            locations_count: 1,
            integrations_required: 0,
            data_sources_count: 1,
            user_count: 10,
            custom_development_required: true,
          },
        })
      );

      expect(custom.estimate.scope_adjustment_usd).toBeGreaterThan(
        standard.estimate.scope_adjustment_usd
      );
    });
  });

  describe("timeline adjustments", () => {
    it("should increase price for accelerated timeline", () => {
      const standard = estimateDealSize(createValidInput({ timeline_preference: "standard" }));
      const accelerated = estimateDealSize(
        createValidInput({ timeline_preference: "accelerated" })
      );

      expect(accelerated.estimate.timeline_adjustment_usd).toBeGreaterThan(
        standard.estimate.timeline_adjustment_usd
      );
    });

    it("should decrease price for extended timeline", () => {
      const standard = estimateDealSize(createValidInput({ timeline_preference: "standard" }));
      const extended = estimateDealSize(createValidInput({ timeline_preference: "extended" }));

      expect(extended.estimate.timeline_adjustment_usd).toBeLessThan(
        standard.estimate.timeline_adjustment_usd
      );
    });
  });

  describe("deal structure", () => {
    it("should provide services breakdown summing to total", () => {
      const result = estimateDealSize(createValidInput());

      const breakdownTotal = result.deal_structure.services_breakdown.reduce(
        (sum, item) => sum + item.estimated_value_usd,
        0
      );
      // Allow for rounding differences
      expect(Math.abs(breakdownTotal - result.estimate.total_estimated_value_usd)).toBeLessThan(
        result.estimate.total_estimated_value_usd * 0.05
      );
    });

    it("should provide recommended phases", () => {
      const result = estimateDealSize(createValidInput());

      expect(result.deal_structure.recommended_phases.length).toBeGreaterThan(0);
      result.deal_structure.recommended_phases.forEach((phase) => {
        expect(phase.phase).toBeDefined();
        expect(phase.duration_weeks).toBeGreaterThan(0);
        expect(phase.value_usd).toBeGreaterThan(0);
        expect(phase.deliverables.length).toBeGreaterThan(0);
      });
    });

    it("should recommend appropriate payment structure", () => {
      const result = estimateDealSize(createValidInput());

      expect(result.deal_structure.payment_structure).toBeDefined();
      expect(result.deal_structure.payment_structure.length).toBeGreaterThan(0);
    });
  });

  describe("margin analysis", () => {
    it("should calculate estimated cost and margin", () => {
      const result = estimateDealSize(createValidInput());

      expect(result.margin_analysis.estimated_cost_usd).toBeGreaterThan(0);
      expect(result.margin_analysis.estimated_margin_percent).toBeGreaterThan(0);
      expect(result.margin_analysis.estimated_margin_percent).toBeLessThan(100);
    });

    it("should assess margin risk", () => {
      const result = estimateDealSize(createValidInput());

      expect(["low", "medium", "high"]).toContain(result.margin_analysis.margin_risk);
    });

    it("should provide margin improvement opportunities", () => {
      const result = estimateDealSize(createValidInput());

      expect(result.margin_analysis.margin_improvement_opportunities.length).toBeGreaterThan(0);
    });

    it("should show lower margin for complex engagements", () => {
      const simple = estimateDealSize(
        createValidInput({
          engagement_type: "assessment",
          complexity_factors: {
            regulatory_requirements: "none",
            legacy_system_integration: false,
            multi_language_support: false,
            real_time_requirements: false,
            high_availability_sla: false,
          },
        })
      );
      const complex = estimateDealSize(
        createValidInput({
          engagement_type: "transformation",
          complexity_factors: {
            regulatory_requirements: "critical",
            legacy_system_integration: true,
            multi_language_support: true,
            real_time_requirements: true,
            high_availability_sla: true,
          },
        })
      );

      expect(complex.margin_analysis.estimated_margin_percent).toBeLessThanOrEqual(
        simple.margin_analysis.estimated_margin_percent
      );
    });
  });

  describe("competitive positioning", () => {
    it("should provide market rate range", () => {
      const result = estimateDealSize(createValidInput());

      expect(result.competitive_positioning.market_rate_range_usd.low).toBeGreaterThan(0);
      expect(result.competitive_positioning.market_rate_range_usd.mid).toBeGreaterThan(0);
      expect(result.competitive_positioning.market_rate_range_usd.high).toBeGreaterThan(0);
    });

    it("should recommend premium position for sole source", () => {
      const result = estimateDealSize(createValidInput({ competitive_situation: "sole_source" }));

      expect(result.competitive_positioning.recommended_position).toBe("premium");
    });

    it("should recommend value position for highly competitive", () => {
      const result = estimateDealSize(
        createValidInput({ competitive_situation: "highly_competitive" })
      );

      expect(result.competitive_positioning.recommended_position).toBe("value");
    });

    it("should provide differentiation points", () => {
      const result = estimateDealSize(createValidInput());

      expect(result.competitive_positioning.differentiation_points.length).toBeGreaterThan(0);
    });
  });

  describe("expansion potential", () => {
    it("should calculate multi-year expansion", () => {
      const result = estimateDealSize(createValidInput());

      expect(result.expansion_potential.year_1_expansion_usd).toBeGreaterThanOrEqual(0);
      expect(result.expansion_potential.year_2_expansion_usd).toBeGreaterThanOrEqual(0);
      expect(result.expansion_potential.year_3_expansion_usd).toBeGreaterThanOrEqual(0);
    });

    it("should calculate total account potential", () => {
      const result = estimateDealSize(createValidInput());

      expect(result.expansion_potential.total_account_potential_usd).toBeGreaterThan(
        result.estimate.total_estimated_value_usd
      );
    });

    it("should show higher expansion for assessment than transformation", () => {
      const assessment = estimateDealSize(createValidInput({ engagement_type: "assessment" }));
      const transformation = estimateDealSize(
        createValidInput({ engagement_type: "transformation" })
      );

      // Assessment should have higher year 1 expansion relative to deal size
      const assessmentExpansionRatio =
        assessment.expansion_potential.year_1_expansion_usd /
        assessment.estimate.total_estimated_value_usd;
      const transformationExpansionRatio =
        transformation.expansion_potential.year_1_expansion_usd /
        transformation.estimate.total_estimated_value_usd;

      expect(assessmentExpansionRatio).toBeGreaterThan(transformationExpansionRatio);
    });

    it("should provide expansion opportunities", () => {
      const result = estimateDealSize(createValidInput());

      expect(result.expansion_potential.expansion_opportunities.length).toBeGreaterThan(0);
    });
  });

  describe("deal risks", () => {
    it("should identify risks for competitive situations", () => {
      const result = estimateDealSize(
        createValidInput({ competitive_situation: "highly_competitive" })
      );

      const competitiveRisk = result.deal_risks.find((r) =>
        r.risk.toLowerCase().includes("competition")
      );
      expect(competitiveRisk).toBeDefined();
    });

    it("should identify risks for legacy integration", () => {
      const result = estimateDealSize(
        createValidInput({
          complexity_factors: {
            regulatory_requirements: "none",
            legacy_system_integration: true,
            multi_language_support: false,
            real_time_requirements: false,
            high_availability_sla: false,
          },
        })
      );

      const legacyRisk = result.deal_risks.find(
        (r) => r.risk.toLowerCase().includes("legacy") || r.risk.toLowerCase().includes("scope")
      );
      expect(legacyRisk).toBeDefined();
    });

    it("should provide mitigations for all risks", () => {
      const result = estimateDealSize(createValidInput());

      result.deal_risks.forEach((risk) => {
        expect(risk.mitigation).toBeDefined();
        expect(risk.mitigation.length).toBeGreaterThan(0);
      });
    });
  });

  describe("negotiation guidance", () => {
    it("should provide walk away, target, and anchor values", () => {
      const result = estimateDealSize(createValidInput());

      expect(result.negotiation_guidance.walk_away_threshold_usd).toBeGreaterThan(0);
      expect(result.negotiation_guidance.target_value_usd).toBeGreaterThan(0);
      expect(result.negotiation_guidance.anchor_value_usd).toBeGreaterThan(0);
    });

    it("should have correct value ordering", () => {
      const result = estimateDealSize(createValidInput());

      expect(result.negotiation_guidance.walk_away_threshold_usd).toBeLessThan(
        result.negotiation_guidance.target_value_usd
      );
      expect(result.negotiation_guidance.target_value_usd).toBeLessThan(
        result.negotiation_guidance.anchor_value_usd
      );
    });

    it("should provide key value levers", () => {
      const result = estimateDealSize(createValidInput());

      expect(result.negotiation_guidance.key_value_levers.length).toBeGreaterThan(0);
    });

    it("should provide common objection responses", () => {
      const result = estimateDealSize(createValidInput());

      expect(result.negotiation_guidance.common_objections.length).toBeGreaterThan(0);
      result.negotiation_guidance.common_objections.forEach((obj) => {
        expect(obj.objection).toBeDefined();
        expect(obj.response).toBeDefined();
      });
    });
  });

  describe("confidence levels", () => {
    it("should have high confidence for simple scopes", () => {
      const result = estimateDealSize(
        createValidInput({
          scope_dimensions: {
            departments_involved: 1,
            locations_count: 1,
            integrations_required: 0,
            data_sources_count: 1,
            user_count: 10,
            custom_development_required: false,
          },
          complexity_factors: {
            regulatory_requirements: "none",
            legacy_system_integration: false,
            multi_language_support: false,
            real_time_requirements: false,
            high_availability_sla: false,
          },
          client_ai_maturity: "experimenting",
        })
      );

      expect(result.estimate.confidence).toBe("high");
    });

    it("should have lower confidence for complex scopes", () => {
      const result = estimateDealSize(
        createValidInput({
          scope_dimensions: {
            departments_involved: 5,
            locations_count: 10,
            integrations_required: 20,
            data_sources_count: 50,
            user_count: 5000,
            custom_development_required: true,
          },
          complexity_factors: {
            regulatory_requirements: "critical",
            legacy_system_integration: true,
            multi_language_support: true,
            real_time_requirements: true,
            high_availability_sla: true,
          },
          client_ai_maturity: "none",
        })
      );

      expect(["low", "medium"]).toContain(result.estimate.confidence);
    });
  });

  describe("recommendations", () => {
    it("should provide actionable recommendations", () => {
      const result = estimateDealSize(createValidInput());

      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    it("should include relationship-specific recommendations", () => {
      const newClient = estimateDealSize(createValidInput({ existing_relationship: false }));
      const existingClient = estimateDealSize(createValidInput({ existing_relationship: true }));

      const newRecommendations = newClient.recommendations.join(" ").toLowerCase();
      const existingRecommendations = existingClient.recommendations.join(" ").toLowerCase();

      expect(newRecommendations).toMatch(/phased|trust/);
      expect(existingRecommendations).toMatch(/relationship|commitment|multi/);
    });
  });

  describe("deterministic output", () => {
    it("should produce identical results for identical input", () => {
      const input = createValidInput();

      const result1 = estimateDealSize(input);
      const result2 = estimateDealSize(input);

      expect(result1).toEqual(result2);
    });
  });
});

describe("EstimateDealSizeInputSchema", () => {
  it("should reject invalid engagement type", () => {
    const input = {
      company_name: "Test",
      industry: "manufacturing",
      employee_count: 100,
      engagement_type: "invalid_type",
      scope_dimensions: {
        departments_involved: 1,
        locations_count: 1,
        integrations_required: 0,
        data_sources_count: 1,
        user_count: 10,
        custom_development_required: false,
      },
    };

    const result = EstimateDealSizeInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should reject negative employee count", () => {
    const input = {
      company_name: "Test",
      industry: "manufacturing",
      employee_count: -100,
      engagement_type: "implementation",
      scope_dimensions: {
        departments_involved: 1,
        locations_count: 1,
        integrations_required: 0,
        data_sources_count: 1,
        user_count: 10,
        custom_development_required: false,
      },
    };

    const result = EstimateDealSizeInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should accept valid minimal input", () => {
    const input = {
      company_name: "Test Corp",
      industry: "general",
      employee_count: 100,
      engagement_type: "pilot",
      scope_dimensions: {
        departments_involved: 1,
        locations_count: 1,
        integrations_required: 0,
        data_sources_count: 1,
        user_count: 10,
        custom_development_required: false,
      },
    };

    const result = EstimateDealSizeInputSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("should apply defaults for optional fields", () => {
    const input = {
      company_name: "Test Corp",
      industry: "general",
      employee_count: 100,
      engagement_type: "pilot",
      scope_dimensions: {
        departments_involved: 1,
        locations_count: 1,
        integrations_required: 0,
        data_sources_count: 1,
        user_count: 10,
        custom_development_required: false,
      },
    };

    const result = EstimateDealSizeInputSchema.parse(input);
    expect(result.timeline_preference).toBe("standard");
    expect(result.client_ai_maturity).toBe("experimenting");
    expect(result.existing_relationship).toBe(false);
    expect(result.competitive_situation).toBe("competitive");
  });
});
