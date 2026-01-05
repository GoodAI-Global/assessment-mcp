/**
 * Good AI - Audit Trail Tests
 */

import {
  AuditTrail,
  createAuditTrail,
  getRecentAuditEntries,
  getAuditEntriesByCorrelationId,
  getAuditEntriesByTool,
  clearAuditStore,
} from "../../src/lib/audit.js";
import { resetConfig, setConfig, type ServerConfig } from "../../src/lib/config.js";

describe("AuditTrail", () => {
  const defaultConfig: ServerConfig = {
    serverName: "test-server",
    version: "1.0.0",
    environment: "development",
    logging: {
      level: "silent",
      timestamps: true,
      format: "json",
      includeStackTraces: false,
    },
    audit: {
      enabled: true,
      logInputs: true,
      logOutputs: true,
      maxPayloadSize: 10000,
      redactSensitiveFields: true,
      sensitiveFields: ["password", "token", "secret"],
    },
    security: {
      maxRequestSize: 1048576,
      rateLimitPerMinute: 0,
    },
  };

  beforeEach(() => {
    clearAuditStore();
    setConfig(defaultConfig);
  });

  afterEach(() => {
    resetConfig();
  });

  describe("createAuditTrail", () => {
    it("should create audit trail with unique correlation ID", () => {
      const trail1 = createAuditTrail();
      const trail2 = createAuditTrail();

      expect(trail1.getCorrelationId()).toBeDefined();
      expect(trail2.getCorrelationId()).toBeDefined();
      expect(trail1.getCorrelationId()).not.toBe(trail2.getCorrelationId());
    });

    it("should use provided correlation ID", () => {
      const customId = "custom-correlation-123";
      const trail = createAuditTrail(customId);

      expect(trail.getCorrelationId()).toBe(customId);
    });
  });

  describe("recordToolInvocation", () => {
    it("should record tool invocation with input", () => {
      const trail = createAuditTrail();
      const input = { company_name: "Test Corp", industry: "manufacturing" };

      const auditId = trail.recordToolInvocation("assess_ai_readiness", input);

      expect(auditId).toBeDefined();
      expect(auditId).toMatch(/^audit_/);

      const entries = getRecentAuditEntries(10);
      expect(entries.length).toBe(1);
      expect(entries[0].eventType).toBe("tool_invocation");
      expect(entries[0].toolName).toBe("assess_ai_readiness");
      expect(entries[0].correlationId).toBe(trail.getCorrelationId());
    });

    it("should redact sensitive fields", () => {
      const trail = createAuditTrail();
      const input = {
        company_name: "Test Corp",
        password: "secret123",
        api_token: "abc123",
      };

      trail.recordToolInvocation("test_tool", input);

      const entries = getRecentAuditEntries(10);
      const recordedInput = entries[0].input as Record<string, unknown>;
      expect(recordedInput.company_name).toBe("Test Corp");
      expect(recordedInput.password).toBe("[REDACTED]");
      expect(recordedInput.api_token).toBe("[REDACTED]");
    });
  });

  describe("recordToolSuccess", () => {
    it("should record successful tool execution", () => {
      const trail = createAuditTrail();
      const output = { score: 8.5, recommendation: "Proceed" };

      trail.recordToolSuccess("audit_123", "test_tool", output, 150);

      const entries = getRecentAuditEntries(10);
      expect(entries.length).toBe(1);
      expect(entries[0].eventType).toBe("tool_success");
      expect(entries[0].success).toBe(true);
      expect(entries[0].durationMs).toBe(150);
    });
  });

  describe("recordToolError", () => {
    it("should record tool execution error", () => {
      const trail = createAuditTrail();
      const error = { code: "VALIDATION_ERROR", message: "Invalid input" };

      trail.recordToolError("audit_123", "test_tool", error, 50);

      const entries = getRecentAuditEntries(10);
      expect(entries.length).toBe(1);
      expect(entries[0].eventType).toBe("tool_error");
      expect(entries[0].success).toBe(false);
      expect(entries[0].error).toEqual(error);
    });
  });

  describe("recordValidationError", () => {
    it("should record validation errors", () => {
      const trail = createAuditTrail();
      const validationErrors = [
        "industry: Invalid enum value",
        "employee_count: Required",
      ];

      trail.recordValidationError("test_tool", validationErrors, { bad: "input" });

      const entries = getRecentAuditEntries(10);
      expect(entries.length).toBe(1);
      expect(entries[0].eventType).toBe("validation_error");
      expect(entries[0].error?.code).toBe("VALIDATION_ERROR");
      expect(entries[0].error?.message).toContain("Invalid enum value");
    });
  });

  describe("recordSecurityViolation", () => {
    it("should record security violations", () => {
      const trail = createAuditTrail();

      trail.recordSecurityViolation("unknown_tool_access", {
        toolName: "dangerous_tool",
        source: "external",
      });

      const entries = getRecentAuditEntries(10);
      expect(entries.length).toBe(1);
      expect(entries[0].eventType).toBe("security_violation");
      expect(entries[0].success).toBe(false);
      expect(entries[0].error?.code).toBe("SECURITY_VIOLATION");
    });
  });

  describe("payload truncation", () => {
    it("should truncate large payloads", () => {
      setConfig({
        ...defaultConfig,
        audit: { ...defaultConfig.audit, maxPayloadSize: 100 },
      });

      const trail = createAuditTrail();
      const largeInput = { data: "x".repeat(500) };

      trail.recordToolInvocation("test_tool", largeInput);

      const entries = getRecentAuditEntries(10);
      const inputStr = JSON.stringify(entries[0].input);
      expect(inputStr.length).toBeLessThan(200);
      expect(inputStr).toContain("TRUNCATED");
    });
  });

  describe("audit disabled", () => {
    it("should not store entries when audit is disabled", () => {
      setConfig({
        ...defaultConfig,
        audit: { ...defaultConfig.audit, enabled: false },
      });

      const trail = createAuditTrail();
      trail.recordToolInvocation("test_tool", { foo: "bar" });

      const entries = getRecentAuditEntries(10);
      expect(entries.length).toBe(0);
    });
  });

  describe("query functions", () => {
    beforeEach(() => {
      const trail1 = createAuditTrail("corr-1");
      trail1.recordToolInvocation("tool_a", {});
      trail1.recordToolSuccess("audit_1", "tool_a", {}, 100);

      const trail2 = createAuditTrail("corr-2");
      trail2.recordToolInvocation("tool_b", {});
      trail2.recordToolError("audit_2", "tool_b", { code: "ERR", message: "fail" }, 50);

      const trail3 = createAuditTrail("corr-1");
      trail3.recordToolInvocation("tool_a", {});
    });

    it("should filter by correlation ID", () => {
      const entries = getAuditEntriesByCorrelationId("corr-1");
      expect(entries.length).toBe(3);
      entries.forEach((e) => expect(e.correlationId).toBe("corr-1"));
    });

    it("should filter by tool name", () => {
      const entries = getAuditEntriesByTool("tool_a", 100);
      expect(entries.length).toBe(3);
      entries.forEach((e) => expect(e.toolName).toBe("tool_a"));
    });

    it("should limit results", () => {
      const entries = getRecentAuditEntries(2);
      expect(entries.length).toBe(2);
    });
  });
});

describe("AuditTrail input/output logging config", () => {
  beforeEach(() => {
    clearAuditStore();
  });

  afterEach(() => {
    resetConfig();
  });

  it("should not log inputs when disabled", () => {
    setConfig({
      serverName: "test",
      version: "1.0.0",
      environment: "production",
      logging: { level: "silent", timestamps: true, format: "json", includeStackTraces: false },
      audit: {
        enabled: true,
        logInputs: false,
        logOutputs: true,
        maxPayloadSize: 10000,
        redactSensitiveFields: true,
        sensitiveFields: [],
      },
      security: { maxRequestSize: 1048576, rateLimitPerMinute: 0 },
    });

    const trail = createAuditTrail();
    trail.recordToolInvocation("test", { secret: "data" });

    const entries = getRecentAuditEntries(10);
    expect(entries[0].input).toEqual({ logged: false, reason: "input_logging_disabled" });
  });

  it("should not log outputs when disabled", () => {
    setConfig({
      serverName: "test",
      version: "1.0.0",
      environment: "production",
      logging: { level: "silent", timestamps: true, format: "json", includeStackTraces: false },
      audit: {
        enabled: true,
        logInputs: true,
        logOutputs: false,
        maxPayloadSize: 10000,
        redactSensitiveFields: true,
        sensitiveFields: [],
      },
      security: { maxRequestSize: 1048576, rateLimitPerMinute: 0 },
    });

    const trail = createAuditTrail();
    trail.recordToolSuccess("audit_1", "test", { result: "data" }, 100);

    const entries = getRecentAuditEntries(10);
    expect(entries[0].output).toEqual({ logged: false, reason: "output_logging_disabled" });
  });
});
