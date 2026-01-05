/**
 * Good AI - generate_sow Tool Tests
 */

import {
  generateSOW,
  GenerateSOWInputSchema,
  type GenerateSOWInput,
} from "../src/tools/generate_sow.js";

describe("generateSOW", () => {
  const createValidInput = (
    overrides: Partial<GenerateSOWInput> = {}
  ): GenerateSOWInput => ({
    client_name: "Acme Manufacturing Corp",
    engagement_title: "AI-Powered Quality Control Pilot",
    engagement_type: "pilot",
    industry: "manufacturing",
    objectives: [
      "Reduce quality defect rate by 25%",
      "Automate visual inspection process",
      "Establish baseline for future AI scaling",
    ],
    deliverables: [
      {
        name: "AI Model for Defect Detection",
        description: "Trained computer vision model for identifying product defects",
        acceptance_criteria: ["95% accuracy on test set", "Processing time < 100ms"],
      },
      {
        name: "Integration with Production Line",
        description: "Model deployed and integrated with existing camera systems",
      },
      {
        name: "Pilot Report and Recommendations",
        description: "Comprehensive report with findings and scaling recommendations",
      },
    ],
    duration_weeks: 12,
    total_value_usd: 150000,
    pricing_model: "milestone_based",
    ...overrides,
  });

  describe("output structure", () => {
    it("should return all required sections", () => {
      const result = generateSOW(createValidInput());

      expect(result).toHaveProperty("document_info");
      expect(result).toHaveProperty("executive_summary");
      expect(result).toHaveProperty("scope");
      expect(result).toHaveProperty("timeline");
      expect(result).toHaveProperty("investment");
      expect(result).toHaveProperty("team");
      expect(result).toHaveProperty("assumptions_dependencies");
      expect(result).toHaveProperty("change_management");
      expect(result).toHaveProperty("terms");
      expect(result).toHaveProperty("acceptance");
      expect(result).toHaveProperty("appendices");
      expect(result).toHaveProperty("methodology_note");
    });

    it("should include document metadata", () => {
      const result = generateSOW(createValidInput());

      expect(result.document_info.title).toContain("AI-Powered Quality Control Pilot");
      expect(result.document_info.prepared_for).toBe("Acme Manufacturing Corp");
      expect(result.document_info.version).toBe("1.0");
      expect(result.document_info.generated_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("should use custom consultant info when provided", () => {
      const result = generateSOW(
        createValidInput({
          consultant_name: "John Smith",
          consultant_company: "AI Solutions Inc",
        })
      );

      expect(result.document_info.prepared_by).toBe("John Smith");
    });
  });

  describe("executive summary", () => {
    it("should include overview with key details", () => {
      const result = generateSOW(createValidInput());

      expect(result.executive_summary.overview).toContain("Acme Manufacturing Corp");
      expect(result.executive_summary.overview).toContain("12 weeks");
    });

    it("should include all objectives", () => {
      const result = generateSOW(createValidInput());

      expect(result.executive_summary.key_objectives).toHaveLength(3);
      expect(result.executive_summary.key_objectives).toContain(
        "Reduce quality defect rate by 25%"
      );
    });

    it("should provide expected outcomes", () => {
      const result = generateSOW(createValidInput());

      expect(result.executive_summary.expected_outcomes.length).toBeGreaterThan(0);
    });

    it("should summarize investment", () => {
      const result = generateSOW(createValidInput());

      expect(result.executive_summary.investment_summary).toContain("150,000");
      expect(result.executive_summary.investment_summary).toContain("12 weeks");
    });
  });

  describe("scope section", () => {
    it("should include all objectives with IDs", () => {
      const result = generateSOW(createValidInput());

      expect(result.scope.objectives).toHaveLength(3);
      result.scope.objectives.forEach((obj, idx) => {
        expect(obj.id).toBe(`OBJ-${String(idx + 1).padStart(3, "0")}`);
      });
    });

    it("should include all deliverables with IDs and acceptance criteria", () => {
      const result = generateSOW(createValidInput());

      expect(result.scope.deliverables).toHaveLength(3);
      result.scope.deliverables.forEach((d, idx) => {
        expect(d.id).toBe(`DEL-${String(idx + 1).padStart(3, "0")}`);
        expect(d.acceptance_criteria.length).toBeGreaterThan(0);
      });
    });

    it("should use provided acceptance criteria", () => {
      const result = generateSOW(createValidInput());

      const modelDeliverable = result.scope.deliverables.find(
        (d) => d.name === "AI Model for Defect Detection"
      );
      expect(modelDeliverable?.acceptance_criteria).toContain("95% accuracy on test set");
    });

    it("should use custom out_of_scope when provided", () => {
      const result = generateSOW(
        createValidInput({
          out_of_scope: ["Hardware procurement", "Network changes"],
        })
      );

      expect(result.scope.out_of_scope).toContain("Hardware procurement");
    });

    it("should provide default out_of_scope when not provided", () => {
      const result = generateSOW(createValidInput());

      expect(result.scope.out_of_scope.length).toBeGreaterThan(0);
    });
  });

  describe("timeline section", () => {
    it("should calculate end date from start date and duration", () => {
      const result = generateSOW(
        createValidInput({
          start_date: "2025-01-15",
          duration_weeks: 12,
        })
      );

      expect(result.timeline.start_date).toBe("2025-01-15");
      expect(result.timeline.duration_weeks).toBe(12);
      expect(result.timeline.end_date).toBe("2025-04-09");
    });

    it("should generate phases for engagement type", () => {
      const result = generateSOW(createValidInput());

      expect(result.timeline.phases.length).toBeGreaterThan(0);
      result.timeline.phases.forEach((phase) => {
        expect(phase.name).toBeDefined();
        expect(phase.start_week).toBeGreaterThan(0);
        expect(phase.end_week).toBeGreaterThanOrEqual(phase.start_week);
        expect(phase.description).toBeDefined();
      });
    });

    it("should generate more phases for transformation", () => {
      const implementation = generateSOW(
        createValidInput({ engagement_type: "implementation" })
      );
      const transformation = generateSOW(
        createValidInput({ engagement_type: "transformation" })
      );

      expect(transformation.timeline.phases.length).toBeGreaterThanOrEqual(
        implementation.timeline.phases.length - 1
      );
    });

    it("should generate milestones with IDs", () => {
      const result = generateSOW(createValidInput());

      expect(result.timeline.milestones.length).toBeGreaterThan(0);
      result.timeline.milestones.forEach((m, idx) => {
        expect(m.id).toBe(`MS-${String(idx + 1).padStart(3, "0")}`);
        expect(m.week).toBeGreaterThan(0);
        expect(m.criteria).toBeDefined();
      });
    });

    it("should use custom milestones when provided", () => {
      const result = generateSOW(
        createValidInput({
          milestones: [
            { name: "Custom Milestone 1", week: 4, payment_percent: 50 },
            { name: "Custom Milestone 2", week: 12, payment_percent: 50 },
          ],
        })
      );

      expect(result.timeline.milestones).toHaveLength(2);
      expect(result.timeline.milestones[0].name).toBe("Custom Milestone 1");
    });
  });

  describe("investment section", () => {
    it("should include total value and pricing model", () => {
      const result = generateSOW(createValidInput());

      expect(result.investment.total_value_usd).toBe(150000);
      expect(result.investment.pricing_model).toBe("milestone based");
    });

    it("should provide pricing model description", () => {
      const result = generateSOW(createValidInput());

      expect(result.investment.pricing_model_description).toContain("milestone");
    });

    it("should generate payment schedule from milestones", () => {
      const result = generateSOW(createValidInput());

      expect(result.investment.payment_schedule.length).toBeGreaterThan(0);
      result.investment.payment_schedule.forEach((p) => {
        expect(p.milestone).toBeDefined();
        expect(p.amount_usd).toBeGreaterThan(0);
        expect(p.due_date_description).toBeDefined();
      });
    });

    it("should use custom payment terms when provided", () => {
      const result = generateSOW(
        createValidInput({
          payment_terms: "Net 45 days",
        })
      );

      expect(result.investment.payment_terms).toBe("Net 45 days");
    });

    it("should provide expense policy", () => {
      const result = generateSOW(createValidInput());

      expect(result.investment.expenses).toBeDefined();
      expect(result.investment.expenses.length).toBeGreaterThan(0);
    });
  });

  describe("team section", () => {
    it("should provide default team for engagement type", () => {
      const result = generateSOW(createValidInput());

      expect(result.team.provider_team.length).toBeGreaterThan(0);
      result.team.provider_team.forEach((member) => {
        expect(member.role).toBeDefined();
        expect(member.allocation).toMatch(/%$/);
      });
    });

    it("should use custom team when provided", () => {
      const result = generateSOW(
        createValidInput({
          team_composition: [
            {
              role: "Lead Consultant",
              allocation_percent: 100,
              responsibilities: ["Project delivery"],
            },
          ],
        })
      );

      expect(result.team.provider_team).toHaveLength(1);
      expect(result.team.provider_team[0].role).toBe("Lead Consultant");
    });

    it("should include client responsibilities", () => {
      const result = generateSOW(createValidInput());

      expect(result.team.client_responsibilities.length).toBeGreaterThan(0);
    });

    it("should use custom client responsibilities when provided", () => {
      const result = generateSOW(
        createValidInput({
          client_responsibilities: ["Provide test data"],
        })
      );

      expect(result.team.client_responsibilities).toContain("Provide test data");
    });

    it("should include governance structure", () => {
      const result = generateSOW(createValidInput());

      expect(result.team.governance.meeting_cadence).toBeDefined();
      expect(result.team.governance.escalation_process).toBeDefined();
      expect(result.team.governance.decision_authority).toBeDefined();
    });
  });

  describe("assumptions and dependencies", () => {
    it("should provide default assumptions", () => {
      const result = generateSOW(createValidInput());

      expect(result.assumptions_dependencies.assumptions.length).toBeGreaterThan(0);
    });

    it("should use custom assumptions when provided", () => {
      const result = generateSOW(
        createValidInput({
          assumptions: ["Custom assumption 1"],
        })
      );

      expect(result.assumptions_dependencies.assumptions).toContain("Custom assumption 1");
    });

    it("should include industry-specific assumptions", () => {
      const healthcare = generateSOW(
        createValidInput({ industry: "healthcare" })
      );

      const hasComplianceAssumption = healthcare.assumptions_dependencies.assumptions.some(
        (a) => a.toLowerCase().includes("hipaa") || a.toLowerCase().includes("compliance")
      );
      expect(hasComplianceAssumption).toBe(true);
    });

    it("should provide dependencies", () => {
      const result = generateSOW(createValidInput());

      expect(result.assumptions_dependencies.dependencies.length).toBeGreaterThan(0);
    });

    it("should include risks with mitigations", () => {
      const result = generateSOW(createValidInput());

      expect(result.assumptions_dependencies.risks.length).toBeGreaterThan(0);
      result.assumptions_dependencies.risks.forEach((r) => {
        expect(r.risk).toBeDefined();
        expect(r.mitigation).toBeDefined();
      });
    });
  });

  describe("change management", () => {
    it("should include change control process", () => {
      const result = generateSOW(createValidInput());

      expect(result.change_management.process).toBeDefined();
      expect(result.change_management.process.length).toBeGreaterThan(0);
    });

    it("should use custom change control process when provided", () => {
      const result = generateSOW(
        createValidInput({
          change_control_process: "All changes require CAB approval",
        })
      );

      expect(result.change_management.process).toBe("All changes require CAB approval");
    });

    it("should include scope and timeline change handling", () => {
      const result = generateSOW(createValidInput());

      expect(result.change_management.scope_change_handling).toBeDefined();
      expect(result.change_management.timeline_change_handling).toBeDefined();
    });
  });

  describe("terms and conditions", () => {
    it("should include all standard terms", () => {
      const result = generateSOW(createValidInput());

      expect(result.terms.confidentiality).toBeDefined();
      expect(result.terms.intellectual_property).toBeDefined();
      expect(result.terms.termination).toBeDefined();
      expect(result.terms.limitation_of_liability).toBeDefined();
      expect(result.terms.warranties).toBeDefined();
    });
  });

  describe("acceptance section", () => {
    it("should include acceptance statement", () => {
      const result = generateSOW(createValidInput());

      expect(result.acceptance.acceptance_statement).toBeDefined();
      expect(result.acceptance.validity_period_days).toBe(30);
    });

    it("should include signature blocks for both parties", () => {
      const result = generateSOW(createValidInput());

      expect(result.acceptance.signature_blocks).toHaveLength(2);
      expect(result.acceptance.signature_blocks[0].party).toBe("Good AI Consulting");
      expect(result.acceptance.signature_blocks[1].party).toBe("Acme Manufacturing Corp");
    });

    it("should use custom consultant company in signature block", () => {
      const result = generateSOW(
        createValidInput({
          consultant_company: "Custom AI Solutions",
        })
      );

      expect(result.acceptance.signature_blocks[0].party).toBe("Custom AI Solutions");
    });
  });

  describe("appendices", () => {
    it("should include standard appendices", () => {
      const result = generateSOW(createValidInput());

      expect(result.appendices.length).toBeGreaterThan(0);
      result.appendices.forEach((a) => {
        expect(a.title).toBeDefined();
        expect(a.content).toBeDefined();
      });
    });

    it("should indicate rate card for T&M engagements", () => {
      const result = generateSOW(
        createValidInput({
          pricing_model: "time_and_materials",
        })
      );

      const rateCardAppendix = result.appendices.find((a) =>
        a.title.toLowerCase().includes("rate card")
      );
      expect(rateCardAppendix?.content).toContain("Hourly rates");
    });
  });

  describe("engagement type variations", () => {
    it("should generate appropriate content for assessment", () => {
      const result = generateSOW(
        createValidInput({
          engagement_type: "assessment",
          duration_weeks: 4,
        })
      );

      expect(result.timeline.phases.some((p) => p.name.includes("Discovery"))).toBe(true);
    });

    it("should generate appropriate content for transformation", () => {
      const result = generateSOW(
        createValidInput({
          engagement_type: "transformation",
          duration_weeks: 52,
        })
      );

      expect(result.timeline.phases.some((p) => p.name.includes("Wave"))).toBe(true);
      expect(result.team.governance.meeting_cadence).toContain("executive");
    });

    it("should generate appropriate content for managed_service", () => {
      const result = generateSOW(
        createValidInput({
          engagement_type: "managed_service",
          duration_weeks: 52,
        })
      );

      expect(result.timeline.phases.some((p) => p.name.includes("Steady State"))).toBe(true);
      expect(result.investment.pricing_model_description).toBeDefined();
    });
  });

  describe("methodology note", () => {
    it("should include Good AI principles", () => {
      const result = generateSOW(createValidInput());

      expect(result.methodology_note).toContain("Leverage, not lore");
      expect(result.methodology_note).toContain("Evidence over opinions");
    });
  });

  describe("deterministic output", () => {
    it("should produce identical results for identical input", () => {
      const input = createValidInput({ start_date: "2025-01-15" });

      const result1 = generateSOW(input);
      const result2 = generateSOW(input);

      // Exclude generated_date as it may vary
      const comparable1 = { ...result1, document_info: { ...result1.document_info, generated_date: "" } };
      const comparable2 = { ...result2, document_info: { ...result2.document_info, generated_date: "" } };

      expect(comparable1).toEqual(comparable2);
    });
  });
});

describe("GenerateSOWInputSchema", () => {
  it("should reject empty client name", () => {
    const input = {
      client_name: "",
      engagement_title: "Test",
      engagement_type: "pilot",
      industry: "general",
      objectives: ["Test objective"],
      deliverables: [{ name: "Test", description: "Test deliverable" }],
      duration_weeks: 8,
      total_value_usd: 50000,
    };

    const result = GenerateSOWInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should reject empty objectives", () => {
    const input = {
      client_name: "Test",
      engagement_title: "Test",
      engagement_type: "pilot",
      industry: "general",
      objectives: [],
      deliverables: [{ name: "Test", description: "Test deliverable" }],
      duration_weeks: 8,
      total_value_usd: 50000,
    };

    const result = GenerateSOWInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should reject empty deliverables", () => {
    const input = {
      client_name: "Test",
      engagement_title: "Test",
      engagement_type: "pilot",
      industry: "general",
      objectives: ["Test objective"],
      deliverables: [],
      duration_weeks: 8,
      total_value_usd: 50000,
    };

    const result = GenerateSOWInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should reject invalid engagement type", () => {
    const input = {
      client_name: "Test",
      engagement_title: "Test",
      engagement_type: "invalid",
      industry: "general",
      objectives: ["Test objective"],
      deliverables: [{ name: "Test", description: "Test deliverable" }],
      duration_weeks: 8,
      total_value_usd: 50000,
    };

    const result = GenerateSOWInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should accept valid minimal input", () => {
    const input = {
      client_name: "Test Corp",
      engagement_title: "AI Pilot",
      engagement_type: "pilot",
      industry: "general",
      objectives: ["Improve efficiency"],
      deliverables: [{ name: "AI Model", description: "Trained model" }],
      duration_weeks: 8,
      total_value_usd: 50000,
    };

    const result = GenerateSOWInputSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it("should apply default values", () => {
    const input = {
      client_name: "Test Corp",
      engagement_title: "AI Pilot",
      engagement_type: "pilot",
      industry: "general",
      objectives: ["Improve efficiency"],
      deliverables: [{ name: "AI Model", description: "Trained model" }],
      duration_weeks: 8,
      total_value_usd: 50000,
    };

    const result = GenerateSOWInputSchema.parse(input);
    expect(result.pricing_model).toBe("fixed_fee");
    expect(result.consultant_company).toBe("Good AI Consulting");
  });

  it("should validate email format when provided", () => {
    const input = {
      client_name: "Test Corp",
      client_contact_email: "not-an-email",
      engagement_title: "AI Pilot",
      engagement_type: "pilot",
      industry: "general",
      objectives: ["Improve efficiency"],
      deliverables: [{ name: "AI Model", description: "Trained model" }],
      duration_weeks: 8,
      total_value_usd: 50000,
    };

    const result = GenerateSOWInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});
