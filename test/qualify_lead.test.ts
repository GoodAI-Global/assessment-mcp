/**
 * Good AI - qualify_lead Tool Tests
 */

import {
  qualifyLead,
  QualifyLeadInputSchema,
  type QualifyLeadInput,
} from "../src/tools/qualify_lead.js";

describe("qualifyLead", () => {
  const createValidInput = (
    overrides: Partial<QualifyLeadInput> = {}
  ): QualifyLeadInput => ({
    company_name: "Acme Manufacturing",
    industry: "manufacturing",
    employee_count: 500,
    annual_revenue_usd: 50000000,
    pain_points: [
      "High manual data entry causing errors",
      "Quality inspection is slow and inconsistent",
      "Difficulty forecasting demand",
    ],
    current_technology_maturity: "medium",
    decision_timeline: "this_quarter",
    budget_indication: "moderate",
    champion_identified: true,
    executive_sponsor: false,
    previous_ai_experience: "limited",
    ...overrides,
  });

  describe("output structure", () => {
    it("should return all required fields", () => {
      const result = qualifyLead(createValidInput());

      expect(result).toHaveProperty("company_name");
      expect(result).toHaveProperty("industry");
      expect(result).toHaveProperty("qualification_score");
      expect(result).toHaveProperty("qualification_tier");
      expect(result).toHaveProperty("scores");
      expect(result).toHaveProperty("fit_assessment");
      expect(result).toHaveProperty("key_strengths");
      expect(result).toHaveProperty("key_concerns");
      expect(result).toHaveProperty("recommended_actions");
      expect(result).toHaveProperty("deal_potential");
      expect(result).toHaveProperty("next_steps");
      expect(result).toHaveProperty("methodology_note");
    });

    it("should include BANT scores", () => {
      const result = qualifyLead(createValidInput());

      expect(result.scores).toHaveProperty("fit_score");
      expect(result.scores).toHaveProperty("budget_score");
      expect(result.scores).toHaveProperty("authority_score");
      expect(result.scores).toHaveProperty("need_score");
      expect(result.scores).toHaveProperty("timing_score");
    });
  });

  describe("qualification tiers", () => {
    it("should qualify hot lead with strong signals", () => {
      const input = createValidInput({
        pain_points: [
          "Critical automation needed",
          "Manual errors costing millions",
          "Executive mandate to digitize",
          "Competitors ahead in AI",
        ],
        decision_timeline: "immediate",
        budget_indication: "significant",
        champion_identified: true,
        executive_sponsor: true,
      });

      const result = qualifyLead(input);

      expect(result.qualification_tier).toBe("hot");
      expect(result.qualification_score).toBeGreaterThanOrEqual(7.5);
    });

    it("should qualify warm lead with moderate signals", () => {
      const result = qualifyLead(createValidInput());

      expect(["hot", "warm"]).toContain(result.qualification_tier);
    });

    it("should qualify nurture lead with weak signals", () => {
      const input = createValidInput({
        pain_points: ["General interest in AI"],
        decision_timeline: "exploring",
        budget_indication: "undefined",
        champion_identified: false,
        executive_sponsor: false,
      });

      const result = qualifyLead(input);

      expect(["nurture", "disqualify"]).toContain(result.qualification_tier);
    });

    it("should disqualify poor fit lead", () => {
      const input = createValidInput({
        employee_count: 10,
        pain_points: ["Minor interest"],
        decision_timeline: "exploring",
        budget_indication: "limited",
        current_technology_maturity: "low",
      });

      const result = qualifyLead(input);

      expect(["nurture", "disqualify"]).toContain(result.qualification_tier);
    });
  });

  describe("fit scoring", () => {
    it("should score higher for ideal company size", () => {
      const idealSize = qualifyLead(
        createValidInput({ employee_count: 500 })
      );
      const smallSize = qualifyLead(
        createValidInput({ employee_count: 25 })
      );

      expect(idealSize.scores.fit_score).toBeGreaterThan(smallSize.scores.fit_score);
    });

    it("should score higher for core industries", () => {
      const coreIndustry = qualifyLead(
        createValidInput({ industry: "manufacturing" })
      );
      const generalIndustry = qualifyLead(
        createValidInput({ industry: "general" })
      );

      expect(coreIndustry.scores.fit_score).toBeGreaterThan(generalIndustry.scores.fit_score);
    });

    it("should assess company size fit correctly", () => {
      const idealFit = qualifyLead(
        createValidInput({ industry: "manufacturing", employee_count: 500 })
      );
      const poorFit = qualifyLead(
        createValidInput({ industry: "manufacturing", employee_count: 5 })
      );

      expect(idealFit.fit_assessment.company_size_fit).toBe("ideal");
      expect(poorFit.fit_assessment.company_size_fit).toBe("poor");
    });
  });

  describe("BANT scoring", () => {
    it("should score budget based on indication", () => {
      const significant = qualifyLead(
        createValidInput({ budget_indication: "significant" })
      );
      const limited = qualifyLead(
        createValidInput({ budget_indication: "limited" })
      );

      expect(significant.scores.budget_score).toBeGreaterThan(limited.scores.budget_score);
    });

    it("should score authority higher with executive sponsor", () => {
      const withSponsor = qualifyLead(
        createValidInput({ executive_sponsor: true, champion_identified: true })
      );
      const withoutSponsor = qualifyLead(
        createValidInput({ executive_sponsor: false, champion_identified: false })
      );

      expect(withSponsor.scores.authority_score).toBeGreaterThan(
        withoutSponsor.scores.authority_score
      );
    });

    it("should score need higher with more pain points", () => {
      const manyPains = qualifyLead(
        createValidInput({
          pain_points: ["Pain 1", "Pain 2", "Pain 3", "Pain 4", "Pain 5"],
        })
      );
      const fewPains = qualifyLead(
        createValidInput({ pain_points: ["One pain point"] })
      );

      expect(manyPains.scores.need_score).toBeGreaterThan(fewPains.scores.need_score);
    });

    it("should score timing based on decision timeline", () => {
      const immediate = qualifyLead(
        createValidInput({ decision_timeline: "immediate" })
      );
      const exploring = qualifyLead(
        createValidInput({ decision_timeline: "exploring" })
      );

      expect(immediate.scores.timing_score).toBeGreaterThan(exploring.scores.timing_score);
    });
  });

  describe("deal potential estimation", () => {
    it("should estimate larger deals for larger companies", () => {
      const large = qualifyLead(
        createValidInput({ employee_count: 5000 })
      );
      const small = qualifyLead(
        createValidInput({ employee_count: 100 })
      );

      expect(large.deal_potential.estimated_deal_size_usd).toBeGreaterThan(
        small.deal_potential.estimated_deal_size_usd
      );
    });

    it("should adjust for budget indication", () => {
      const significant = qualifyLead(
        createValidInput({ budget_indication: "significant" })
      );
      const limited = qualifyLead(
        createValidInput({ budget_indication: "limited" })
      );

      expect(significant.deal_potential.estimated_deal_size_usd).toBeGreaterThan(
        limited.deal_potential.estimated_deal_size_usd
      );
    });

    it("should determine deal type based on size", () => {
      const enterprise = qualifyLead(
        createValidInput({ employee_count: 5000, budget_indication: "significant" })
      );

      expect(["enterprise", "strategic"]).toContain(enterprise.deal_potential.deal_type);
    });
  });

  describe("strengths and concerns", () => {
    it("should identify strengths for high-scoring areas", () => {
      const input = createValidInput({
        decision_timeline: "immediate",
        budget_indication: "significant",
        executive_sponsor: true,
      });

      const result = qualifyLead(input);

      expect(result.key_strengths.length).toBeGreaterThan(0);
    });

    it("should identify concerns for low-scoring areas", () => {
      const input = createValidInput({
        budget_indication: "undefined",
        champion_identified: false,
        executive_sponsor: false,
        current_technology_maturity: "low",
      });

      const result = qualifyLead(input);

      expect(result.key_concerns.length).toBeGreaterThan(0);
    });
  });

  describe("recommended actions and next steps", () => {
    it("should provide actions for hot leads", () => {
      const input = createValidInput({
        pain_points: [
          "Urgent automation need",
          "Critical quality issues",
          "Executive mandate",
          "Competitive pressure",
        ],
        decision_timeline: "immediate",
        budget_indication: "significant",
        executive_sponsor: true,
        champion_identified: true,
      });

      const result = qualifyLead(input);

      expect(result.recommended_actions.length).toBeGreaterThan(0);
      expect(result.next_steps.length).toBeGreaterThan(0);
    });

    it("should provide nurture actions for cold leads", () => {
      const input = createValidInput({
        pain_points: ["Exploring options"],
        decision_timeline: "exploring",
        budget_indication: "undefined",
      });

      const result = qualifyLead(input);

      expect(result.recommended_actions.length).toBeGreaterThan(0);
    });
  });

  describe("disqualification", () => {
    it("should provide disqualification reasons when disqualified", () => {
      const input = createValidInput({
        employee_count: 10,
        pain_points: ["Not really interested"],
        decision_timeline: "exploring",
        budget_indication: "limited",
        current_technology_maturity: "low",
      });

      const result = qualifyLead(input);

      if (result.qualification_tier === "disqualify") {
        expect(result.disqualification_reasons.length).toBeGreaterThan(0);
      }
    });

    it("should not have disqualification reasons for qualified leads", () => {
      const result = qualifyLead(createValidInput());

      if (result.qualification_tier !== "disqualify") {
        expect(result.disqualification_reasons).toHaveLength(0);
      }
    });
  });

  describe("qualification rationale", () => {
    it("should provide meaningful rationale", () => {
      const result = qualifyLead(createValidInput());

      expect(result.qualification_rationale).toContain(result.company_name);
      expect(result.qualification_rationale).toContain(
        result.qualification_score.toString()
      );
    });
  });

  describe("deterministic output", () => {
    it("should produce identical results for identical input", () => {
      const input = createValidInput();

      const result1 = qualifyLead(input);
      const result2 = qualifyLead(input);

      expect(result1).toEqual(result2);
    });
  });
});

describe("QualifyLeadInputSchema", () => {
  it("should reject empty pain points", () => {
    const input = {
      company_name: "Test",
      industry: "manufacturing",
      employee_count: 100,
      pain_points: [],
    };

    const result = QualifyLeadInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should reject invalid industry", () => {
    const input = {
      company_name: "Test",
      industry: "invalid_industry",
      employee_count: 100,
      pain_points: ["A pain point"],
    };

    const result = QualifyLeadInputSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it("should accept valid minimal input", () => {
    const input = {
      company_name: "Test Corp",
      industry: "general",
      employee_count: 100,
      pain_points: ["Need to improve efficiency"],
    };

    const result = QualifyLeadInputSchema.safeParse(input);
    expect(result.success).toBe(true);
  });
});
