/**
 * Good AI - Configuration Tests
 */

import {
  loadConfig,
  getConfig,
  resetConfig,
  setConfig,
  type ServerConfig,
} from "../../src/lib/config.js";

describe("Configuration", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    resetConfig();
  });

  afterEach(() => {
    process.env = originalEnv;
    resetConfig();
  });

  describe("loadConfig", () => {
    it("should load default configuration", () => {
      const config = loadConfig();

      expect(config.serverName).toBe("goodai-assessment");
      expect(config.version).toBe("1.0.0");
      expect(config.environment).toBe("development");
      expect(config.logging.level).toBe("debug");
      expect(config.audit.enabled).toBe(true);
    });

    it("should respect NODE_ENV for environment", () => {
      process.env.NODE_ENV = "production";
      const config = loadConfig();

      expect(config.environment).toBe("production");
      expect(config.logging.level).toBe("info");
      expect(config.logging.format).toBe("json");
    });

    it("should parse LOG_LEVEL", () => {
      process.env.LOG_LEVEL = "warn";
      const config = loadConfig();

      expect(config.logging.level).toBe("warn");
    });

    it("should parse boolean environment variables", () => {
      process.env.AUDIT_ENABLED = "false";
      process.env.LOG_TIMESTAMPS = "true";
      const config = loadConfig();

      expect(config.audit.enabled).toBe(false);
      expect(config.logging.timestamps).toBe(true);
    });

    it("should parse integer environment variables", () => {
      process.env.AUDIT_MAX_PAYLOAD_SIZE = "5000";
      process.env.MAX_REQUEST_SIZE = "2097152";
      const config = loadConfig();

      expect(config.audit.maxPayloadSize).toBe(5000);
      expect(config.security.maxRequestSize).toBe(2097152);
    });

    it("should parse comma-separated lists", () => {
      process.env.AUDIT_SENSITIVE_FIELDS = "custom_field,another_secret,api_key";
      const config = loadConfig();

      expect(config.audit.sensitiveFields).toEqual(["custom_field", "another_secret", "api_key"]);
    });

    it("should handle invalid log level gracefully", () => {
      process.env.LOG_LEVEL = "invalid_level";
      const config = loadConfig();

      expect(config.logging.level).toBe("info");
    });

    it("should handle invalid environment gracefully", () => {
      process.env.NODE_ENV = "invalid_env";
      const config = loadConfig();

      expect(config.environment).toBe("development");
    });
  });

  describe("getConfig", () => {
    it("should return singleton instance", () => {
      const config1 = getConfig();
      const config2 = getConfig();

      expect(config1).toBe(config2);
    });

    it("should reload after reset", () => {
      const config1 = getConfig();
      resetConfig();
      process.env.LOG_LEVEL = "error";
      const config2 = getConfig();

      expect(config1.logging.level).not.toBe(config2.logging.level);
    });
  });

  describe("setConfig", () => {
    it("should override configuration", () => {
      const customConfig: ServerConfig = {
        serverName: "custom-server",
        version: "2.0.0",
        environment: "staging",
        logging: {
          level: "error",
          timestamps: false,
          format: "pretty",
          includeStackTraces: true,
        },
        audit: {
          enabled: false,
          logInputs: false,
          logOutputs: false,
          maxPayloadSize: 1000,
          redactSensitiveFields: false,
          sensitiveFields: [],
        },
        security: {
          maxRequestSize: 500000,
          rateLimitPerMinute: 100,
        },
      };

      setConfig(customConfig);
      const config = getConfig();

      expect(config.serverName).toBe("custom-server");
      expect(config.version).toBe("2.0.0");
      expect(config.environment).toBe("staging");
    });
  });

  describe("production defaults", () => {
    it("should use secure defaults in production", () => {
      process.env.NODE_ENV = "production";
      const config = loadConfig();

      expect(config.logging.format).toBe("json");
      expect(config.logging.includeStackTraces).toBe(false);
      expect(config.audit.logInputs).toBe(false);
      expect(config.audit.logOutputs).toBe(false);
    });
  });
});
