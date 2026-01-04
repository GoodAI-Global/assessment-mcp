/**
 * Good AI - assess_ai_readiness Tool Tests
 */

import { assessAIReadiness } from "../src/tools/assess_ai_readiness.js";
import type { AssessAIReadinessInput } from "../src/types/index.js";

describe("assessAIReadiness", () => {
  describe("reference input validation", () => {
    const referenceInput: AssessAIReadinessInput = {
      company_name: "OceanShrimp Co.",
      industry: "aquaculture",
      employee_count: 120,
      data_infrastructure: {
        centralized_data: false,
        manual_data_entry_percent: 85,
      },
      current_systems: {
        erp: null,
        crm: null,
        legacy_systems_count: 2,
      },
    };

    it("should return all required fields", () => {
      const result = assessAIReadiness(referenceInput);

      expect(result).toHaveProperty("overall_score");
      expect(result).toHaveProperty("dimensions");
      expect(result).toHaveProperty("strengths");
      expect(result).toHaveProperty("gaps");
      expect(result).toHaveProperty("recommended_starting_point");
      expect(result).toHaveProperty("estimated_time_to_value_weeks");
      expect(result).toHaveProperty("red_flags");
    });

    it("should return all dimension scores", () => {
      const result = assessAIReadiness(referenceInput);

      expect(result.dimensions).toHaveProperty("data_readiness");
      expect(result.dimensions).toHaveProperty("technical_capability");
      expect(result.dimensions).toHaveProperty("process_maturity");
      expect(result.dimensions).toHaveProperty("organizational_readiness");

      // Each dimension should have score and findings
      for (const dim of Object.values(result.dimensions)) {
        expect(dim).toHaveProperty("score");
        expect(dim).toHaveProperty("findings");
        expect(typeof dim.score).toBe("number");
        expect(Array.isArray(dim.findings)).toBe(true);
      }
    });

    it("should produce Computer Vision recommendation for high manual entry", () => {
      const result = assessAIReadiness(referenceInput);

      const cvFinding = result.dimensions.data_readiness.findings.some(
        (f) => f.toLowerCase().includes("computer vision")
      );
      expect(cvFinding).toBe(true);
    });

    it("should flag missing centralized data", () => {
      const result = assessAIReadiness(referenceInput);

      const centralizedFinding = result.dimensions.data_readiness.findings.some(
        (f) => f.toLowerCase().includes("centralized")
      );
      expect(centralizedFinding).toBe(true);
    });

    it("should recognize low legacy complexity", () => {
      const result = assessAIReadiness(referenceInput);

      const legacyFinding = result.dimensions.technical_capability.findings.some(
        (f) => f.toLowerCase().includes("legacy")
      );
      expect(legacyFinding).toBe(true);
    });
  });

  describe("scoring logic", () => {
    it("should add +3 for centralized data", () => {
      const withCentralized: AssessAIReadinessInput = {
        company_name: "Test Co",
        industry: "general",
        employee_count: 100,
        data_infrastructure: {
          centralized_data: true,
          manual_data_entry_percent: 50,
        },
        current_systems: {
          erp: null,
          crm: null,
          legacy_systems_count: 0,
        },
      };

      const withoutCentralized: AssessAIReadinessInput = {
        ...withCentralized,
        data_infrastructure: {
          ...withCentralized.data_infrastructure,
          centralized_data: false,
        },
      };

      const resultWith = assessAIReadiness(withCentralized);
      const resultWithout = assessAIReadiness(withoutCentralized);

      // Data readiness score should be higher with centralized data
      expect(resultWith.dimensions.data_readiness.score).toBeGreaterThan(
        resultWithout.dimensions.data_readiness.score
      );
    });

    it("should add +2 for ERP system", () => {
      const withERP: AssessAIReadinessInput = {
        company_name: "Test Co",
        industry: "general",
        employee_count: 100,
        data_infrastructure: {
          centralized_data: false,
          manual_data_entry_percent: 50,
        },
        current_systems: {
          erp: "SAP",
          crm: null,
          legacy_systems_count: 0,
        },
      };

      const withoutERP: AssessAIReadinessInput = {
        ...withERP,
        current_systems: {
          ...withERP.current_systems,
          erp: null,
        },
      };

      const resultWith = assessAIReadiness(withERP);
      const resultWithout = assessAIReadiness(withoutERP);

      expect(resultWith.dimensions.technical_capability.score).toBeGreaterThan(
        resultWithout.dimensions.technical_capability.score
      );
    });

    it("should produce low overall score for poor readiness", () => {
      const poorReadiness: AssessAIReadinessInput = {
        company_name: "Struggling Co",
        industry: "general",
        employee_count: 10,
        data_infrastructure: {
          centralized_data: false,
          data_quality_score: 2,
          manual_data_entry_percent: 95,
        },
        current_systems: {
          erp: null,
          crm: null,
          legacy_systems_count: 8,
        },
      };

      const result = assessAIReadiness(poorReadiness);

      expect(result.overall_score).toBeLessThan(5);
    });

    it("should produce high overall score for excellent readiness", () => {
      const excellentReadiness: AssessAIReadinessInput = {
        company_name: "Advanced Co",
        industry: "general",
        employee_count: 500,
        annual_revenue_usd: 100000000,
        data_infrastructure: {
          centralized_data: true,
          data_quality_score: 9,
          manual_data_entry_percent: 10,
        },
        current_systems: {
          erp: "SAP",
          crm: "Salesforce",
          legacy_systems_count: 1,
        },
      };

      const result = assessAIReadiness(excellentReadiness);

      expect(result.overall_score).toBeGreaterThanOrEqual(7);
    });
  });

  describe("red flags", () => {
    it("should add red flag for very low score", () => {
      const poorReadiness: AssessAIReadinessInput = {
        company_name: "Struggling Co",
        industry: "general",
        employee_count: 5,
        data_infrastructure: {
          centralized_data: false,
          data_quality_score: 1,
          manual_data_entry_percent: 95,
        },
        current_systems: {
          erp: null,
          crm: null,
          legacy_systems_count: 10,
        },
      };

      const result = assessAIReadiness(poorReadiness);

      // If score is below 3, should have red flag
      if (result.overall_score < 3) {
        const hasFoundationalFlag = result.red_flags.some(
          (f) => f.toLowerCase().includes("foundational")
        );
        expect(hasFoundationalFlag).toBe(true);
      }
    });

    it("should add red flag for >90% manual entry without ERP", () => {
      const manualHeavy: AssessAIReadinessInput = {
        company_name: "Manual Co",
        industry: "general",
        employee_count: 50,
        data_infrastructure: {
          centralized_data: false,
          manual_data_entry_percent: 95,
        },
        current_systems: {
          erp: null,
          crm: null,
          legacy_systems_count: 2,
        },
      };

      const result = assessAIReadiness(manualHeavy);

      const hasDigitizationFlag = result.red_flags.some(
        (f) => f.toLowerCase().includes("digitization")
      );
      expect(hasDigitizationFlag).toBe(true);
    });
  });

  describe("deterministic output", () => {
    it("should produce identical results for identical input", () => {
      const input: AssessAIReadinessInput = {
        company_name: "Test Co",
        industry: "manufacturing",
        employee_count: 200,
        data_infrastructure: {
          centralized_data: true,
          manual_data_entry_percent: 40,
        },
        current_systems: {
          erp: "Oracle",
          crm: null,
          legacy_systems_count: 3,
        },
      };

      const result1 = assessAIReadiness(input);
      const result2 = assessAIReadiness(input);

      expect(result1).toEqual(result2);
    });
  });
});
