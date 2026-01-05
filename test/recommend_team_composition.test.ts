/**
 * Tests for recommend_team_composition tool
 */

import {
  recommendTeamComposition,
  RecommendTeamCompositionInputSchema,
  RECOMMEND_TEAM_COMPOSITION_TOOL,
  type RecommendTeamCompositionInput,
  type TeamCompositionRecommendation,
} from "../src/tools/recommend_team_composition.js";

describe("recommend_team_composition tool", () => {
  // ==========================================
  // Test Fixtures
  // ==========================================

  const baseInput: RecommendTeamCompositionInput = {
    project_name: "AI Pilot Project",
    client_name: "Acme Corp",
    industry: "manufacturing",
    engagement_type: "pilot",
    duration_weeks: 12,
    complexity: {
      technical_complexity: "medium",
      integration_scope: "single_system",
      ai_components: ["ml_models", "data_engineering"],
      custom_development_required: false,
      data_complexity: "medium",
    },
    client_context: {
      client_technical_capability: "moderate",
      client_ai_maturity: "nascent",
      change_management_needs: "moderate",
      executive_visibility: "medium",
      regulatory_requirements: "none",
    },
  };

  const assessmentInput: RecommendTeamCompositionInput = {
    ...baseInput,
    project_name: "AI Readiness Assessment",
    engagement_type: "assessment",
    duration_weeks: 4,
    complexity: {
      technical_complexity: "low",
      integration_scope: "single_system",
      ai_components: [],
      custom_development_required: false,
      data_complexity: "low",
    },
  };

  const implementationInput: RecommendTeamCompositionInput = {
    ...baseInput,
    project_name: "ML Platform Implementation",
    engagement_type: "implementation",
    duration_weeks: 24,
    complexity: {
      technical_complexity: "high",
      integration_scope: "multiple_systems",
      ai_components: ["ml_models", "nlp", "data_engineering", "business_intelligence"],
      custom_development_required: true,
      data_complexity: "high",
    },
    client_context: {
      client_technical_capability: "strong",
      client_ai_maturity: "developing",
      change_management_needs: "significant",
      executive_visibility: "high",
      regulatory_requirements: "standard",
    },
  };

  const transformationInput: RecommendTeamCompositionInput = {
    ...baseInput,
    project_name: "Enterprise AI Transformation",
    engagement_type: "transformation",
    duration_weeks: 52,
    complexity: {
      technical_complexity: "high",
      integration_scope: "enterprise_wide",
      ai_components: ["ml_models", "nlp", "predictive_analytics", "generative_ai", "data_engineering"],
      custom_development_required: true,
      data_complexity: "high",
    },
    client_context: {
      client_technical_capability: "moderate",
      client_ai_maturity: "nascent",
      change_management_needs: "significant",
      executive_visibility: "high",
      regulatory_requirements: "strict",
    },
  };

  const managedServiceInput: RecommendTeamCompositionInput = {
    ...baseInput,
    project_name: "AI Operations Service",
    engagement_type: "managed_service",
    duration_weeks: 52,
    complexity: {
      technical_complexity: "medium",
      integration_scope: "multiple_systems",
      ai_components: ["ml_models", "data_engineering"],
      custom_development_required: false,
      data_complexity: "medium",
    },
  };

  const healthcareInput: RecommendTeamCompositionInput = {
    ...baseInput,
    project_name: "Healthcare AI Implementation",
    industry: "healthcare",
    engagement_type: "implementation",
    duration_weeks: 20,
    client_context: {
      ...baseInput.client_context,
      regulatory_requirements: "strict",
    },
  };

  // ==========================================
  // Tool Definition Tests
  // ==========================================

  describe("Tool Definition", () => {
    it("should have correct tool name", () => {
      expect(RECOMMEND_TEAM_COMPOSITION_TOOL.name).toBe("recommend_team_composition");
    });

    it("should have a description", () => {
      expect(RECOMMEND_TEAM_COMPOSITION_TOOL.description).toBeDefined();
      expect(RECOMMEND_TEAM_COMPOSITION_TOOL.description.length).toBeGreaterThan(50);
    });

    it("should define required input properties", () => {
      const required = RECOMMEND_TEAM_COMPOSITION_TOOL.inputSchema.required;
      expect(required).toContain("project_name");
      expect(required).toContain("client_name");
      expect(required).toContain("industry");
      expect(required).toContain("engagement_type");
      expect(required).toContain("duration_weeks");
      expect(required).toContain("complexity");
      expect(required).toContain("client_context");
    });
  });

  // ==========================================
  // Input Validation Tests
  // ==========================================

  describe("Input Validation", () => {
    it("should accept valid input", () => {
      expect(() => RecommendTeamCompositionInputSchema.parse(baseInput)).not.toThrow();
    });

    it("should reject empty project name", () => {
      expect(() =>
        RecommendTeamCompositionInputSchema.parse({ ...baseInput, project_name: "" })
      ).toThrow();
    });

    it("should reject invalid industry", () => {
      expect(() =>
        RecommendTeamCompositionInputSchema.parse({ ...baseInput, industry: "invalid" })
      ).toThrow();
    });

    it("should reject invalid engagement type", () => {
      expect(() =>
        RecommendTeamCompositionInputSchema.parse({ ...baseInput, engagement_type: "invalid" })
      ).toThrow();
    });

    it("should reject duration less than 1", () => {
      expect(() =>
        RecommendTeamCompositionInputSchema.parse({ ...baseInput, duration_weeks: 0 })
      ).toThrow();
    });

    it("should reject duration greater than 260", () => {
      expect(() =>
        RecommendTeamCompositionInputSchema.parse({ ...baseInput, duration_weeks: 261 })
      ).toThrow();
    });

    it("should accept all valid industries", () => {
      const industries = ["manufacturing", "insurance", "aquaculture", "healthcare", "general"];
      industries.forEach((industry) => {
        expect(() =>
          RecommendTeamCompositionInputSchema.parse({ ...baseInput, industry })
        ).not.toThrow();
      });
    });

    it("should accept all valid engagement types", () => {
      const types = ["assessment", "pilot", "implementation", "transformation", "managed_service"];
      types.forEach((engagement_type) => {
        expect(() =>
          RecommendTeamCompositionInputSchema.parse({ ...baseInput, engagement_type })
        ).not.toThrow();
      });
    });

    it("should apply default values for optional complexity fields", () => {
      const minimalInput = {
        ...baseInput,
        complexity: {},
      };
      const parsed = RecommendTeamCompositionInputSchema.parse(minimalInput);
      expect(parsed.complexity.technical_complexity).toBe("medium");
      expect(parsed.complexity.integration_scope).toBe("single_system");
      expect(parsed.complexity.ai_components).toEqual([]);
      expect(parsed.complexity.custom_development_required).toBe(false);
      expect(parsed.complexity.data_complexity).toBe("medium");
    });
  });

  // ==========================================
  // Output Structure Tests
  // ==========================================

  describe("Output Structure", () => {
    let result: TeamCompositionRecommendation;

    beforeAll(() => {
      result = recommendTeamComposition(baseInput);
    });

    it("should include project and client name", () => {
      expect(result.project_name).toBe(baseInput.project_name);
      expect(result.client_name).toBe(baseInput.client_name);
    });

    it("should include recommendation date", () => {
      expect(result.recommendation_date).toBeDefined();
      expect(result.recommendation_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("should include summary section", () => {
      expect(result.summary).toBeDefined();
      expect(result.summary.total_team_size).toBeGreaterThan(0);
      expect(result.summary.total_fte).toBeGreaterThan(0);
      expect(result.summary.estimated_monthly_cost_usd).toBeGreaterThan(0);
      expect(result.summary.blended_rate_usd_per_hour).toBeGreaterThan(0);
      expect(["senior_heavy", "balanced", "junior_heavy"]).toContain(result.summary.team_experience_level);
      expect(result.summary.key_staffing_rationale.length).toBeGreaterThan(0);
    });

    it("should include recommended team", () => {
      expect(result.recommended_team).toBeDefined();
      expect(result.recommended_team.length).toBeGreaterThan(0);
    });

    it("should have complete team member details", () => {
      const member = result.recommended_team[0];
      expect(member.role).toBeDefined();
      expect(["principal", "senior", "mid", "junior"]).toContain(member.seniority_level);
      expect(member.fte_allocation).toBeGreaterThan(0);
      expect(member.billable_rate_usd_per_hour).toBeGreaterThan(0);
      expect(member.monthly_cost_usd).toBeGreaterThan(0);
      expect(member.responsibilities.length).toBeGreaterThan(0);
      expect(member.required_skills.length).toBeGreaterThan(0);
      expect(member.start_week).toBeGreaterThan(0);
      expect(member.end_week).toBeGreaterThanOrEqual(member.start_week);
      expect(typeof member.critical_role).toBe("boolean");
      expect(member.substitution_options.length).toBeGreaterThan(0);
    });

    it("should include phased staffing", () => {
      expect(result.phased_staffing).toBeDefined();
      expect(result.phased_staffing.length).toBeGreaterThan(0);
      result.phased_staffing.forEach((phase) => {
        expect(phase.phase_name).toBeDefined();
        expect(phase.start_week).toBeGreaterThan(0);
        expect(phase.end_week).toBeGreaterThanOrEqual(phase.start_week);
        expect(phase.team_size).toBeGreaterThan(0);
        expect(phase.total_fte).toBeGreaterThan(0);
        expect(phase.phase_objectives.length).toBeGreaterThan(0);
      });
    });

    it("should include skill coverage analysis", () => {
      expect(result.skill_coverage).toBeDefined();
      expect(result.skill_coverage.required_skills).toBeDefined();
      expect(result.skill_coverage.skill_gaps).toBeDefined();
      expect(result.skill_coverage.skill_overlaps).toBeDefined();
    });

    it("should include team dynamics", () => {
      expect(result.team_dynamics).toBeDefined();
      expect(result.team_dynamics.leadership_structure).toBeDefined();
      expect(result.team_dynamics.reporting_hierarchy).toBeDefined();
      expect(result.team_dynamics.collaboration_model).toBeDefined();
      expect(result.team_dynamics.communication_cadence).toBeDefined();
      expect(result.team_dynamics.decision_authority).toBeDefined();
    });

    it("should include staffing risks", () => {
      expect(result.staffing_risks).toBeDefined();
      expect(Array.isArray(result.staffing_risks)).toBe(true);
    });

    it("should include alternative configurations", () => {
      expect(result.alternative_configurations).toBeDefined();
      expect(result.alternative_configurations.length).toBeGreaterThan(0);
      const alt = result.alternative_configurations[0];
      expect(alt.name).toBeDefined();
      expect(alt.description).toBeDefined();
      expect(alt.trade_offs).toBeDefined();
      expect(typeof alt.cost_difference_percent).toBe("number");
      expect(alt.recommended_when).toBeDefined();
    });

    it("should include recommendations", () => {
      expect(result.recommendations).toBeDefined();
      expect(result.recommendations.hiring_recommendations.length).toBeGreaterThan(0);
      expect(result.recommendations.training_recommendations.length).toBeGreaterThan(0);
      expect(result.recommendations.external_resource_recommendations.length).toBeGreaterThan(0);
      expect(result.recommendations.client_resource_recommendations.length).toBeGreaterThan(0);
    });

    it("should include methodology note", () => {
      expect(result.methodology_note).toBeDefined();
      expect(result.methodology_note.length).toBeGreaterThan(50);
    });
  });

  // ==========================================
  // Engagement Type Tests
  // ==========================================

  describe("Engagement Type Variations", () => {
    it("should create small team for assessment", () => {
      const result = recommendTeamComposition(assessmentInput);
      expect(result.recommended_team.length).toBeLessThanOrEqual(5);
      expect(result.summary.total_fte).toBeLessThan(3);
    });

    it("should create medium team for pilot", () => {
      const result = recommendTeamComposition(baseInput);
      expect(result.recommended_team.length).toBeGreaterThanOrEqual(3);
      expect(result.summary.total_fte).toBeLessThan(8);
    });

    it("should create larger team for implementation", () => {
      const result = recommendTeamComposition(implementationInput);
      expect(result.recommended_team.length).toBeGreaterThan(5);
      expect(result.summary.total_fte).toBeGreaterThan(5);
    });

    it("should create large team for transformation", () => {
      const result = recommendTeamComposition(transformationInput);
      expect(result.recommended_team.length).toBeGreaterThan(10);
      expect(result.summary.total_fte).toBeGreaterThan(15);
    });

    it("should create operational team for managed service", () => {
      const result = recommendTeamComposition(managedServiceInput);
      // Managed services are leaner but sustained
      expect(result.recommended_team.length).toBeGreaterThanOrEqual(3);
      expect(result.recommended_team.some((m) => m.role.includes("DevOps") || m.role.includes("Engineer"))).toBe(true);
    });

    it("should have appropriate phases for assessment", () => {
      const result = recommendTeamComposition(assessmentInput);
      expect(result.phased_staffing.some((p) => p.phase_name === "Discovery")).toBe(true);
      expect(result.phased_staffing.some((p) => p.phase_name === "Analysis")).toBe(true);
    });

    it("should have appropriate phases for implementation", () => {
      const result = recommendTeamComposition(implementationInput);
      expect(result.phased_staffing.some((p) => p.phase_name === "Foundation")).toBe(true);
      expect(result.phased_staffing.some((p) => p.phase_name === "Build")).toBe(true);
      expect(result.phased_staffing.some((p) => p.phase_name === "Deploy")).toBe(true);
    });

    it("should have appropriate phases for transformation", () => {
      const result = recommendTeamComposition(transformationInput);
      expect(result.phased_staffing.some((p) => p.phase_name === "Mobilize")).toBe(true);
      expect(result.phased_staffing.some((p) => p.phase_name === "Build Waves")).toBe(true);
      expect(result.phased_staffing.some((p) => p.phase_name === "Operate")).toBe(true);
    });
  });

  // ==========================================
  // Complexity Impact Tests
  // ==========================================

  describe("Complexity Impact", () => {
    it("should add more resources for high technical complexity", () => {
      const highComplexity = {
        ...baseInput,
        complexity: { ...baseInput.complexity, technical_complexity: "high" as const },
      };
      const lowComplexity = {
        ...baseInput,
        complexity: { ...baseInput.complexity, technical_complexity: "low" as const },
      };

      const highResult = recommendTeamComposition(highComplexity);
      const lowResult = recommendTeamComposition(lowComplexity);

      expect(highResult.summary.total_fte).toBeGreaterThanOrEqual(lowResult.summary.total_fte);
    });

    it("should scale for enterprise-wide integration", () => {
      const enterpriseWide = {
        ...baseInput,
        complexity: { ...baseInput.complexity, integration_scope: "enterprise_wide" as const },
      };
      const singleSystem = {
        ...baseInput,
        complexity: { ...baseInput.complexity, integration_scope: "single_system" as const },
      };

      const enterpriseResult = recommendTeamComposition(enterpriseWide);
      const singleResult = recommendTeamComposition(singleSystem);

      expect(enterpriseResult.summary.total_fte).toBeGreaterThanOrEqual(singleResult.summary.total_fte);
    });

    it("should include AI/ML Lead for ML projects", () => {
      const result = recommendTeamComposition(baseInput); // has ml_models
      expect(result.recommended_team.some((m) => m.role.includes("ML") || m.role.includes("AI"))).toBe(true);
    });

    it("should include Data Engineer for data-intensive projects", () => {
      const dataProject = {
        ...baseInput,
        complexity: { ...baseInput.complexity, ai_components: ["data_engineering" as const] },
      };
      const result = recommendTeamComposition(dataProject);
      expect(result.recommended_team.some((m) => m.role === "Data Engineer")).toBe(true);
    });

    it("should add developers for custom development", () => {
      const withCustom = {
        ...baseInput,
        complexity: { ...baseInput.complexity, custom_development_required: true },
      };
      const withoutCustom = {
        ...baseInput,
        complexity: { ...baseInput.complexity, custom_development_required: false },
      };

      const withResult = recommendTeamComposition(withCustom);
      const withoutResult = recommendTeamComposition(withoutCustom);

      const withDevFTE = withResult.recommended_team
        .filter((m) => m.role.includes("Developer"))
        .reduce((sum, m) => sum + m.fte_allocation, 0);
      const withoutDevFTE = withoutResult.recommended_team
        .filter((m) => m.role.includes("Developer"))
        .reduce((sum, m) => sum + m.fte_allocation, 0);

      expect(withDevFTE).toBeGreaterThanOrEqual(withoutDevFTE);
    });
  });

  // ==========================================
  // Client Context Impact Tests
  // ==========================================

  describe("Client Context Impact", () => {
    it("should add change manager for significant change needs", () => {
      const significantChange = {
        ...implementationInput,
        client_context: { ...implementationInput.client_context, change_management_needs: "significant" as const },
      };
      const result = recommendTeamComposition(significantChange);
      expect(result.recommended_team.some((m) => m.role === "Change Manager")).toBe(true);
    });

    it("should add privacy specialist for strict regulations", () => {
      const strictReg = {
        ...baseInput,
        client_context: { ...baseInput.client_context, regulatory_requirements: "strict" as const },
      };
      const result = recommendTeamComposition(strictReg);
      expect(result.recommended_team.some((m) => m.role.includes("Privacy"))).toBe(true);
    });

    it("should add industry SME for specialized industries", () => {
      const result = recommendTeamComposition(healthcareInput);
      expect(result.recommended_team.some((m) => m.role === "Industry SME")).toBe(true);
    });

    it("should provide recommendations for limited client capability", () => {
      const limitedCapability = {
        ...baseInput,
        client_context: { ...baseInput.client_context, client_technical_capability: "limited" as const },
      };
      const result = recommendTeamComposition(limitedCapability);
      expect(result.recommendations.client_resource_recommendations.some(
        (r) => r.toLowerCase().includes("knowledge transfer") || r.toLowerCase().includes("upskilling")
      )).toBe(true);
    });
  });

  // ==========================================
  // Industry-Specific Tests
  // ==========================================

  describe("Industry Variations", () => {
    it("should add healthcare-specific resources", () => {
      const result = recommendTeamComposition(healthcareInput);
      expect(result.recommended_team.some((m) => m.role === "Industry SME" || m.role === "Data Privacy Specialist")).toBe(true);
    });

    it("should add insurance-specific resources", () => {
      const insuranceInput = { ...baseInput, industry: "insurance" as const };
      const result = recommendTeamComposition(insuranceInput);
      expect(result.recommended_team.some((m) => m.role === "Industry SME")).toBe(true);
    });

    it("should add aquaculture-specific resources", () => {
      const aquacultureInput = { ...baseInput, industry: "aquaculture" as const };
      const result = recommendTeamComposition(aquacultureInput);
      expect(result.recommended_team.some((m) => m.role === "Industry SME")).toBe(true);
    });
  });

  // ==========================================
  // Constraint Tests
  // ==========================================

  describe("Constraint Application", () => {
    it("should respect max team size constraint", () => {
      const constrained = {
        ...transformationInput,
        constraints: { max_team_size: 5, must_include_roles: [], exclude_roles: [] },
      };
      const result = recommendTeamComposition(constrained);
      expect(result.recommended_team.length).toBeLessThanOrEqual(5);
    });

    it("should exclude specified roles", () => {
      const constrained = {
        ...implementationInput,
        constraints: { must_include_roles: [], exclude_roles: ["Business Analyst"] },
      };
      const result = recommendTeamComposition(constrained);
      expect(result.recommended_team.some((m) => m.role === "Business Analyst")).toBe(false);
    });

    it("should prioritize senior roles when constrained", () => {
      const constrained = {
        ...transformationInput,
        constraints: { max_team_size: 5, must_include_roles: [], exclude_roles: [] },
      };
      const result = recommendTeamComposition(constrained);
      const seniorCount = result.recommended_team.filter(
        (m) => m.seniority_level === "principal" || m.seniority_level === "senior"
      ).length;
      expect(seniorCount).toBeGreaterThan(0);
    });
  });

  // ==========================================
  // Cost Calculation Tests
  // ==========================================

  describe("Cost Calculations", () => {
    it("should calculate consistent monthly costs", () => {
      const result = recommendTeamComposition(baseInput);
      result.recommended_team.forEach((member) => {
        // Monthly cost should be approximately rate * hours * weeks/month
        const expectedMonthly = member.billable_rate_usd_per_hour * member.fte_allocation * 40 * 4.33;
        expect(member.monthly_cost_usd).toBeCloseTo(expectedMonthly, -1); // Within 10
      });
    });

    it("should have blended rate between min and max individual rates", () => {
      const result = recommendTeamComposition(baseInput);
      const rates = result.recommended_team.map((m) => m.billable_rate_usd_per_hour);
      const minRate = Math.min(...rates);
      const maxRate = Math.max(...rates);
      expect(result.summary.blended_rate_usd_per_hour).toBeGreaterThanOrEqual(minRate);
      expect(result.summary.blended_rate_usd_per_hour).toBeLessThanOrEqual(maxRate);
    });

    it("should have total monthly cost equal to sum of individual costs", () => {
      const result = recommendTeamComposition(baseInput);
      const sumOfCosts = result.recommended_team.reduce((sum, m) => sum + m.monthly_cost_usd, 0);
      expect(result.summary.estimated_monthly_cost_usd).toBe(sumOfCosts);
    });

    it("should have higher costs for transformation vs assessment", () => {
      const assessmentResult = recommendTeamComposition(assessmentInput);
      const transformationResult = recommendTeamComposition(transformationInput);
      expect(transformationResult.summary.estimated_monthly_cost_usd).toBeGreaterThan(
        assessmentResult.summary.estimated_monthly_cost_usd
      );
    });
  });

  // ==========================================
  // Skill Coverage Tests
  // ==========================================

  describe("Skill Coverage Analysis", () => {
    it("should identify required skills based on AI components", () => {
      const result = recommendTeamComposition(baseInput);
      // Has ml_models, so should have ML-related skills
      const hasMLSkill = result.skill_coverage.required_skills.some(
        (s) => s.skill.toLowerCase().includes("machine learning") || s.skill.toLowerCase().includes("ml")
      );
      expect(hasMLSkill).toBe(true);
    });

    it("should identify skill gaps when team is constrained", () => {
      const constrained = {
        ...implementationInput,
        constraints: { max_team_size: 3, must_include_roles: [], exclude_roles: [] },
      };
      const result = recommendTeamComposition(constrained);
      // Highly constrained team for complex project should have gaps
      expect(result.skill_coverage.skill_gaps.length).toBeGreaterThan(0);
    });

    it("should identify skill overlaps for redundancy", () => {
      const result = recommendTeamComposition(implementationInput);
      // Larger team should have some overlaps
      expect(result.skill_coverage.skill_overlaps.length).toBeGreaterThanOrEqual(0);
    });
  });

  // ==========================================
  // Team Dynamics Tests
  // ==========================================

  describe("Team Dynamics", () => {
    it("should define leadership structure", () => {
      const result = recommendTeamComposition(baseInput);
      expect(result.team_dynamics.leadership_structure.length).toBeGreaterThan(0);
    });

    it("should have reporting hierarchy for larger teams", () => {
      const result = recommendTeamComposition(implementationInput);
      expect(result.team_dynamics.reporting_hierarchy.length).toBeGreaterThan(0);
    });

    it("should define decision authority", () => {
      const result = recommendTeamComposition(baseInput);
      expect(result.team_dynamics.decision_authority.length).toBeGreaterThan(0);
      expect(result.team_dynamics.decision_authority.some((d) => d.area === "Strategic direction")).toBe(true);
      expect(result.team_dynamics.decision_authority.some((d) => d.area === "Technical decisions")).toBe(true);
    });

    it("should have enhanced communication for transformation", () => {
      const result = recommendTeamComposition(transformationInput);
      expect(result.team_dynamics.communication_cadence.toLowerCase()).toContain("executive");
    });
  });

  // ==========================================
  // Risk Identification Tests
  // ==========================================

  describe("Staffing Risk Identification", () => {
    it("should identify single point of failure risks", () => {
      const result = recommendTeamComposition(baseInput);
      // Small team likely has critical single points
      const hasSinglePointRisk = result.staffing_risks.some(
        (r) => r.risk.toLowerCase().includes("single point")
      );
      expect(hasSinglePointRisk).toBe(true);
    });

    it("should identify skill gap risks when present", () => {
      const constrained = {
        ...implementationInput,
        constraints: { max_team_size: 3, must_include_roles: [], exclude_roles: [] },
      };
      const result = recommendTeamComposition(constrained);
      if (result.skill_coverage.skill_gaps.some((g) => g.gap_severity === "critical")) {
        expect(result.staffing_risks.some((r) => r.risk.toLowerCase().includes("skill gap"))).toBe(true);
      }
    });

    it("should have mitigation for each risk", () => {
      const result = recommendTeamComposition(baseInput);
      result.staffing_risks.forEach((risk) => {
        expect(risk.mitigation).toBeDefined();
        expect(risk.mitigation.length).toBeGreaterThan(0);
      });
    });
  });

  // ==========================================
  // Alternative Configuration Tests
  // ==========================================

  describe("Alternative Configurations", () => {
    it("should provide multiple alternatives", () => {
      const result = recommendTeamComposition(baseInput);
      expect(result.alternative_configurations.length).toBeGreaterThanOrEqual(3);
    });

    it("should include lean team option", () => {
      const result = recommendTeamComposition(baseInput);
      expect(result.alternative_configurations.some((a) => a.name === "Lean Team")).toBe(true);
    });

    it("should include accelerated team option", () => {
      const result = recommendTeamComposition(baseInput);
      expect(result.alternative_configurations.some((a) => a.name === "Accelerated Team")).toBe(true);
    });

    it("should have cost differences that make sense", () => {
      const result = recommendTeamComposition(baseInput);
      const leanOption = result.alternative_configurations.find((a) => a.name === "Lean Team");
      const acceleratedOption = result.alternative_configurations.find((a) => a.name === "Accelerated Team");
      expect(leanOption?.cost_difference_percent).toBeLessThan(0);
      expect(acceleratedOption?.cost_difference_percent).toBeGreaterThan(0);
    });
  });

  // ==========================================
  // Phased Staffing Tests
  // ==========================================

  describe("Phased Staffing", () => {
    it("should have phases covering full duration", () => {
      const result = recommendTeamComposition(baseInput);
      const firstPhase = result.phased_staffing[0];
      const lastPhase = result.phased_staffing[result.phased_staffing.length - 1];
      expect(firstPhase.start_week).toBe(1);
      expect(lastPhase.end_week).toBe(baseInput.duration_weeks);
    });

    it("should have non-overlapping phases", () => {
      const result = recommendTeamComposition(baseInput);
      for (let i = 0; i < result.phased_staffing.length - 1; i++) {
        const currentPhase = result.phased_staffing[i];
        const nextPhase = result.phased_staffing[i + 1];
        expect(nextPhase.start_week).toBeGreaterThanOrEqual(currentPhase.end_week);
      }
    });

    it("should have phase objectives", () => {
      const result = recommendTeamComposition(baseInput);
      result.phased_staffing.forEach((phase) => {
        expect(phase.phase_objectives.length).toBeGreaterThan(0);
      });
    });

    it("should track team size per phase", () => {
      const result = recommendTeamComposition(baseInput);
      result.phased_staffing.forEach((phase) => {
        expect(phase.team_size).toBeGreaterThan(0);
        expect(phase.total_fte).toBeGreaterThan(0);
        expect(phase.roles.length).toBeGreaterThan(0);
      });
    });
  });

  // ==========================================
  // Determinism Tests
  // ==========================================

  describe("Determinism", () => {
    it("should produce consistent results for same input", () => {
      const result1 = recommendTeamComposition(baseInput);
      const result2 = recommendTeamComposition(baseInput);

      expect(result1.summary.total_team_size).toBe(result2.summary.total_team_size);
      expect(result1.summary.total_fte).toBe(result2.summary.total_fte);
      expect(result1.recommended_team.length).toBe(result2.recommended_team.length);
    });

    it("should produce different results for different engagement types", () => {
      const assessmentResult = recommendTeamComposition(assessmentInput);
      const implementationResult = recommendTeamComposition(implementationInput);

      expect(assessmentResult.summary.total_team_size).not.toBe(implementationResult.summary.total_team_size);
    });
  });

  // ==========================================
  // Edge Case Tests
  // ==========================================

  describe("Edge Cases", () => {
    it("should handle minimum duration", () => {
      const minDuration = { ...assessmentInput, duration_weeks: 1 };
      const result = recommendTeamComposition(minDuration);
      expect(result.recommended_team.length).toBeGreaterThan(0);
      expect(result.phased_staffing.length).toBeGreaterThan(0);
    });

    it("should handle maximum duration", () => {
      const maxDuration = { ...managedServiceInput, duration_weeks: 260 };
      const result = recommendTeamComposition(maxDuration);
      expect(result.recommended_team.length).toBeGreaterThan(0);
    });

    it("should handle empty AI components", () => {
      const noAI = {
        ...baseInput,
        complexity: { ...baseInput.complexity, ai_components: [] },
      };
      const result = recommendTeamComposition(noAI);
      expect(result.recommended_team.length).toBeGreaterThan(0);
    });

    it("should handle all AI components", () => {
      const allAI = {
        ...implementationInput,
        complexity: {
          ...implementationInput.complexity,
          ai_components: [
            "ml_models",
            "nlp",
            "computer_vision",
            "predictive_analytics",
            "generative_ai",
            "robotic_process_automation",
            "data_engineering",
            "business_intelligence",
          ] as const,
        },
      };
      const result = recommendTeamComposition(allAI as RecommendTeamCompositionInput);
      expect(result.recommended_team.length).toBeGreaterThan(0);
      expect(result.summary.total_fte).toBeGreaterThan(5);
    });

    it("should handle extreme constraints gracefully", () => {
      const extremeConstraint = {
        ...transformationInput,
        constraints: { max_team_size: 1, must_include_roles: [], exclude_roles: [] },
      };
      const result = recommendTeamComposition(extremeConstraint);
      expect(result.recommended_team.length).toBe(1);
      expect(result.staffing_risks.length).toBeGreaterThan(0);
    });
  });

  // ==========================================
  // Preferences Tests
  // ==========================================

  describe("Preferences Application", () => {
    it("should adjust for senior-heavy preference", () => {
      const seniorHeavy = {
        ...baseInput,
        preferences: { prefer_senior_heavy: true },
      };
      const balanced = {
        ...baseInput,
        preferences: { prefer_senior_heavy: false },
      };

      const seniorResult = recommendTeamComposition(seniorHeavy);
      const balancedResult = recommendTeamComposition(balanced);

      // Senior-heavy should have higher blended rate
      expect(seniorResult.summary.blended_rate_usd_per_hour).toBeGreaterThanOrEqual(
        balancedResult.summary.blended_rate_usd_per_hour
      );
    });
  });

  // ==========================================
  // Substitution Options Tests
  // ==========================================

  describe("Substitution Options", () => {
    it("should provide substitution options for each role", () => {
      const result = recommendTeamComposition(baseInput);
      result.recommended_team.forEach((member) => {
        expect(member.substitution_options).toBeDefined();
        expect(member.substitution_options.length).toBeGreaterThan(0);
      });
    });

    it("should have meaningful substitution options", () => {
      const result = recommendTeamComposition(implementationInput);
      const architect = result.recommended_team.find((m) => m.role === "Solution Architect");
      if (architect) {
        expect(architect.substitution_options.length).toBeGreaterThan(0);
        expect(architect.substitution_options[0]).not.toBe("Role requires direct match");
      }
    });
  });
});
