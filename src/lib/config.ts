/**
 * Good AI Enterprise Configuration
 * Centralized configuration management with environment variable support
 */

export type LogLevel = "debug" | "info" | "warn" | "error" | "silent";

export interface ServerConfig {
  /** Server name for identification */
  serverName: string;
  /** Server version */
  version: string;
  /** Environment: development, staging, production */
  environment: "development" | "staging" | "production";
  /** Logging configuration */
  logging: {
    /** Minimum log level to output */
    level: LogLevel;
    /** Include timestamps in logs */
    timestamps: boolean;
    /** Output format: json for production, pretty for development */
    format: "json" | "pretty";
    /** Include stack traces in error logs */
    includeStackTraces: boolean;
  };
  /** Audit configuration */
  audit: {
    /** Enable audit logging */
    enabled: boolean;
    /** Include input parameters in audit logs (may contain sensitive data) */
    logInputs: boolean;
    /** Include output in audit logs */
    logOutputs: boolean;
    /** Maximum size of logged input/output in bytes */
    maxPayloadSize: number;
    /** Redact sensitive fields from logs */
    redactSensitiveFields: boolean;
    /** Fields to redact from logs */
    sensitiveFields: string[];
  };
  /** Security configuration */
  security: {
    /** Maximum request size in bytes */
    maxRequestSize: number;
    /** Rate limiting: max requests per minute (0 = disabled) */
    rateLimitPerMinute: number;
  };
}

/**
 * Parse log level from string
 */
function parseLogLevel(value: string | undefined): LogLevel {
  const levels: LogLevel[] = ["debug", "info", "warn", "error", "silent"];
  const normalized = value?.toLowerCase() as LogLevel;
  return levels.includes(normalized) ? normalized : "info";
}

/**
 * Parse environment from string
 */
function parseEnvironment(
  value: string | undefined
): "development" | "staging" | "production" {
  const envs = ["development", "staging", "production"] as const;
  const normalized = value?.toLowerCase() as (typeof envs)[number];
  return envs.includes(normalized) ? normalized : "development";
}

/**
 * Parse boolean from environment variable
 */
function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) {
    return defaultValue;
  }
  return value.toLowerCase() === "true" || value === "1";
}

/**
 * Parse integer from environment variable
 */
function parseInteger(value: string | undefined, defaultValue: number): number {
  if (value === undefined) {
    return defaultValue;
  }
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Parse comma-separated list from environment variable
 */
function parseList(value: string | undefined, defaultValue: string[]): string[] {
  if (value === undefined || value.trim() === "") {
    return defaultValue;
  }
  return value.split(",").map((s) => s.trim());
}

/**
 * Load configuration from environment variables with sensible defaults
 */
export function loadConfig(): ServerConfig {
  const env = process.env;
  const environment = parseEnvironment(env.NODE_ENV);
  const isProduction = environment === "production";

  return {
    serverName: env.GOODAI_SERVER_NAME || "goodai-assessment",
    version: env.GOODAI_VERSION || "1.0.0",
    environment,
    logging: {
      level: parseLogLevel(env.LOG_LEVEL || (isProduction ? "info" : "debug")),
      timestamps: parseBoolean(env.LOG_TIMESTAMPS, true),
      format: isProduction ? "json" : "pretty",
      includeStackTraces: parseBoolean(
        env.LOG_STACK_TRACES,
        !isProduction
      ),
    },
    audit: {
      enabled: parseBoolean(env.AUDIT_ENABLED, true),
      logInputs: parseBoolean(env.AUDIT_LOG_INPUTS, !isProduction),
      logOutputs: parseBoolean(env.AUDIT_LOG_OUTPUTS, false),
      maxPayloadSize: parseInteger(env.AUDIT_MAX_PAYLOAD_SIZE, 10000),
      redactSensitiveFields: parseBoolean(env.AUDIT_REDACT_SENSITIVE, true),
      sensitiveFields: parseList(env.AUDIT_SENSITIVE_FIELDS, [
        "password",
        "token",
        "secret",
        "api_key",
        "apiKey",
        "authorization",
        "credentials",
        "ssn",
        "credit_card",
        "creditCard",
      ]),
    },
    security: {
      maxRequestSize: parseInteger(env.MAX_REQUEST_SIZE, 1048576), // 1MB
      rateLimitPerMinute: parseInteger(env.RATE_LIMIT_PER_MINUTE, 0),
    },
  };
}

/** Singleton configuration instance */
let configInstance: ServerConfig | null = null;

/**
 * Get the current configuration (loads from env on first call)
 */
export function getConfig(): ServerConfig {
  if (!configInstance) {
    configInstance = loadConfig();
  }
  return configInstance;
}

/**
 * Reset configuration (useful for testing)
 */
export function resetConfig(): void {
  configInstance = null;
}

/**
 * Override configuration (useful for testing)
 */
export function setConfig(config: ServerConfig): void {
  configInstance = config;
}
