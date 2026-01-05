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
 * Load configuration from environment variables with sensible defaults
 */
export declare function loadConfig(): ServerConfig;
/**
 * Get the current configuration (loads from env on first call)
 */
export declare function getConfig(): ServerConfig;
/**
 * Reset configuration (useful for testing)
 */
export declare function resetConfig(): void;
/**
 * Override configuration (useful for testing)
 */
export declare function setConfig(config: ServerConfig): void;
//# sourceMappingURL=config.d.ts.map