/**
 * Good AI Enterprise Audit Trail
 * Comprehensive audit logging for compliance and observability
 */
import { getConfig } from "./config.js";
import { Logger, generateCorrelationId } from "./logger.js";
/** In-memory audit store for recent entries */
const auditStore = [];
const MAX_AUDIT_ENTRIES = 1000;
/**
 * Generate a unique audit ID
 */
function generateAuditId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `audit_${timestamp}_${random}`;
}
/**
 * Deep clone an object
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== "object") {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(deepClone);
    }
    const cloned = {};
    for (const key of Object.keys(obj)) {
        cloned[key] = deepClone(obj[key]);
    }
    return cloned;
}
/**
 * Redact sensitive fields from an object
 */
function redactSensitiveFields(obj, sensitiveFields) {
    if (obj === null || typeof obj !== "object") {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map((item) => redactSensitiveFields(item, sensitiveFields));
    }
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();
        const isSensitive = sensitiveFields.some((field) => lowerKey.includes(field.toLowerCase()) ||
            field.toLowerCase().includes(lowerKey));
        if (isSensitive && typeof value === "string") {
            result[key] = "[REDACTED]";
        }
        else if (typeof value === "object" && value !== null) {
            result[key] = redactSensitiveFields(value, sensitiveFields);
        }
        else {
            result[key] = value;
        }
    }
    return result;
}
/**
 * Truncate payload to max size
 */
function truncatePayload(payload, maxSize) {
    const str = JSON.stringify(payload);
    if (str.length <= maxSize) {
        return { data: payload, truncated: false };
    }
    // Truncate and add indicator
    const truncatedStr = str.substring(0, maxSize - 50);
    return {
        data: `${truncatedStr}... [TRUNCATED - original size: ${str.length} bytes]`,
        truncated: true,
    };
}
/**
 * Audit trail manager
 */
export class AuditTrail {
    logger;
    correlationId;
    constructor(correlationId) {
        this.correlationId = correlationId || generateCorrelationId();
        this.logger = new Logger(this.correlationId, { component: "audit" });
    }
    /**
     * Get the correlation ID for this audit trail
     */
    getCorrelationId() {
        return this.correlationId;
    }
    /**
     * Process input for audit logging
     */
    processInput(input) {
        const config = getConfig();
        if (!config.audit.logInputs) {
            return { logged: false, reason: "input_logging_disabled" };
        }
        let processed = deepClone(input);
        if (config.audit.redactSensitiveFields) {
            processed = redactSensitiveFields(processed, config.audit.sensitiveFields);
        }
        const { data, truncated } = truncatePayload(processed, config.audit.maxPayloadSize);
        if (truncated) {
            this.logger.debug("Input payload truncated for audit", {
                originalSize: JSON.stringify(input).length,
                maxSize: config.audit.maxPayloadSize,
            });
        }
        return data;
    }
    /**
     * Process output for audit logging
     */
    processOutput(output) {
        const config = getConfig();
        if (!config.audit.logOutputs) {
            return { logged: false, reason: "output_logging_disabled" };
        }
        const { data, truncated } = truncatePayload(output, config.audit.maxPayloadSize);
        if (truncated) {
            this.logger.debug("Output payload truncated for audit", {
                originalSize: JSON.stringify(output).length,
                maxSize: config.audit.maxPayloadSize,
            });
        }
        return data;
    }
    /**
     * Store audit entry
     */
    storeEntry(entry) {
        const config = getConfig();
        if (!config.audit.enabled) {
            return;
        }
        // Add to in-memory store (circular buffer)
        auditStore.push(entry);
        if (auditStore.length > MAX_AUDIT_ENTRIES) {
            auditStore.shift();
        }
        // Log the audit entry
        const logContext = {
            auditId: entry.id,
            eventType: entry.eventType,
            toolName: entry.toolName,
            success: entry.success,
            durationMs: entry.durationMs,
        };
        if (entry.success) {
            this.logger.info(`Audit: ${entry.eventType}`, logContext);
        }
        else {
            this.logger.warn(`Audit: ${entry.eventType} (failed)`, {
                ...logContext,
                error: entry.error,
            });
        }
    }
    /**
     * Record tool invocation start
     */
    recordToolInvocation(toolName, input, metadata) {
        const entry = {
            id: generateAuditId(),
            correlationId: this.correlationId,
            timestamp: new Date().toISOString(),
            eventType: "tool_invocation",
            toolName,
            success: true,
            input: this.processInput(input),
            metadata,
        };
        this.storeEntry(entry);
        return entry.id;
    }
    /**
     * Record tool success
     */
    recordToolSuccess(auditId, toolName, output, durationMs, metadata) {
        const entry = {
            id: auditId,
            correlationId: this.correlationId,
            timestamp: new Date().toISOString(),
            eventType: "tool_success",
            toolName,
            durationMs,
            success: true,
            output: this.processOutput(output),
            metadata,
        };
        this.storeEntry(entry);
    }
    /**
     * Record tool error
     */
    recordToolError(auditId, toolName, error, durationMs, metadata) {
        const entry = {
            id: auditId,
            correlationId: this.correlationId,
            timestamp: new Date().toISOString(),
            eventType: "tool_error",
            toolName,
            durationMs,
            success: false,
            error,
            metadata,
        };
        this.storeEntry(entry);
    }
    /**
     * Record validation error
     */
    recordValidationError(toolName, validationErrors, input) {
        const entry = {
            id: generateAuditId(),
            correlationId: this.correlationId,
            timestamp: new Date().toISOString(),
            eventType: "validation_error",
            toolName,
            success: false,
            input: this.processInput(input),
            error: {
                code: "VALIDATION_ERROR",
                message: validationErrors.join("; "),
            },
        };
        this.storeEntry(entry);
    }
    /**
     * Record security violation
     */
    recordSecurityViolation(type, details) {
        const entry = {
            id: generateAuditId(),
            correlationId: this.correlationId,
            timestamp: new Date().toISOString(),
            eventType: "security_violation",
            success: false,
            error: {
                code: "SECURITY_VIOLATION",
                message: type,
            },
            metadata: details,
        };
        this.storeEntry(entry);
        this.logger.error(`Security violation: ${type}`, undefined, details);
    }
}
/**
 * Get recent audit entries
 */
export function getRecentAuditEntries(limit = 100) {
    return auditStore.slice(-limit);
}
/**
 * Get audit entries by correlation ID
 */
export function getAuditEntriesByCorrelationId(correlationId) {
    return auditStore.filter((entry) => entry.correlationId === correlationId);
}
/**
 * Get audit entries by tool name
 */
export function getAuditEntriesByTool(toolName, limit = 100) {
    return auditStore
        .filter((entry) => entry.toolName === toolName)
        .slice(-limit);
}
/**
 * Clear audit store (for testing)
 */
export function clearAuditStore() {
    auditStore.length = 0;
}
/**
 * Create a new audit trail for a request
 */
export function createAuditTrail(correlationId) {
    return new AuditTrail(correlationId);
}
//# sourceMappingURL=audit.js.map