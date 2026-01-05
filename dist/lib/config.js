/**
 * Good AI Enterprise Configuration
 * Centralized configuration management with environment variable support
 */
/**
 * Parse log level from string
 */
function parseLogLevel(value) {
    const levels = ["debug", "info", "warn", "error", "silent"];
    const normalized = value?.toLowerCase();
    return levels.includes(normalized) ? normalized : "info";
}
/**
 * Parse environment from string
 */
function parseEnvironment(value) {
    const envs = ["development", "staging", "production"];
    const normalized = value?.toLowerCase();
    return envs.includes(normalized) ? normalized : "development";
}
/**
 * Parse boolean from environment variable
 */
function parseBoolean(value, defaultValue) {
    if (value === undefined) {
        return defaultValue;
    }
    return value.toLowerCase() === "true" || value === "1";
}
/**
 * Parse integer from environment variable
 */
function parseInteger(value, defaultValue) {
    if (value === undefined) {
        return defaultValue;
    }
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
}
/**
 * Parse comma-separated list from environment variable
 */
function parseList(value, defaultValue) {
    if (value === undefined || value.trim() === "") {
        return defaultValue;
    }
    return value.split(",").map((s) => s.trim());
}
/**
 * Load configuration from environment variables with sensible defaults
 */
export function loadConfig() {
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
            includeStackTraces: parseBoolean(env.LOG_STACK_TRACES, !isProduction),
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
let configInstance = null;
/**
 * Get the current configuration (loads from env on first call)
 */
export function getConfig() {
    if (!configInstance) {
        configInstance = loadConfig();
    }
    return configInstance;
}
/**
 * Reset configuration (useful for testing)
 */
export function resetConfig() {
    configInstance = null;
}
/**
 * Override configuration (useful for testing)
 */
export function setConfig(config) {
    configInstance = config;
}
//# sourceMappingURL=config.js.map