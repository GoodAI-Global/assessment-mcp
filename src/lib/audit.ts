/**
 * Good AI Enterprise Audit Trail
 * Comprehensive audit logging for compliance and observability
 */

import { getConfig } from "./config.js";
import { Logger, generateCorrelationId } from "./logger.js";

/** Audit event types */
export type AuditEventType =
  | "tool_invocation"
  | "tool_success"
  | "tool_error"
  | "validation_error"
  | "rate_limit"
  | "security_violation";

/** Audit entry structure */
export interface AuditEntry {
  /** Unique identifier for this audit entry */
  id: string;
  /** Correlation ID linking related events */
  correlationId: string;
  /** ISO timestamp */
  timestamp: string;
  /** Event type */
  eventType: AuditEventType;
  /** Tool name if applicable */
  toolName?: string;
  /** Duration in milliseconds */
  durationMs?: number;
  /** Success or failure */
  success: boolean;
  /** Input parameters (may be redacted) */
  input?: Record<string, unknown>;
  /** Output (may be truncated) */
  output?: unknown;
  /** Error details if failed */
  error?: {
    code: string;
    message: string;
  };
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/** In-memory audit store for recent entries */
const auditStore: AuditEntry[] = [];
const MAX_AUDIT_ENTRIES = 1000;

/**
 * Generate a unique audit ID
 */
function generateAuditId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `audit_${timestamp}_${random}`;
}

/**
 * Deep clone an object
 */
function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(deepClone) as unknown as T;
  }
  const cloned: Record<string, unknown> = {};
  for (const key of Object.keys(obj)) {
    cloned[key] = deepClone((obj as Record<string, unknown>)[key]);
  }
  return cloned as T;
}

/**
 * Redact sensitive fields from an object
 */
function redactSensitiveFields(
  obj: unknown,
  sensitiveFields: string[]
): unknown {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => redactSensitiveFields(item, sensitiveFields));
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = sensitiveFields.some(
      (field) =>
        lowerKey.includes(field.toLowerCase()) ||
        field.toLowerCase().includes(lowerKey)
    );

    if (isSensitive && typeof value === "string") {
      result[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      result[key] = redactSensitiveFields(value, sensitiveFields);
    } else {
      result[key] = value;
    }
  }

  return result;
}

/**
 * Truncate payload to max size
 */
function truncatePayload(
  payload: unknown,
  maxSize: number
): { data: unknown; truncated: boolean } {
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
  private logger: Logger;
  private correlationId: string;

  constructor(correlationId?: string) {
    this.correlationId = correlationId || generateCorrelationId();
    this.logger = new Logger(this.correlationId, { component: "audit" });
  }

  /**
   * Get the correlation ID for this audit trail
   */
  getCorrelationId(): string {
    return this.correlationId;
  }

  /**
   * Process input for audit logging
   */
  private processInput(input: unknown): unknown {
    const config = getConfig();

    if (!config.audit.logInputs) {
      return { logged: false, reason: "input_logging_disabled" };
    }

    let processed = deepClone(input);

    if (config.audit.redactSensitiveFields) {
      processed = redactSensitiveFields(processed, config.audit.sensitiveFields);
    }

    const { data, truncated } = truncatePayload(
      processed,
      config.audit.maxPayloadSize
    );

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
  private processOutput(output: unknown): unknown {
    const config = getConfig();

    if (!config.audit.logOutputs) {
      return { logged: false, reason: "output_logging_disabled" };
    }

    const { data, truncated } = truncatePayload(
      output,
      config.audit.maxPayloadSize
    );

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
  private storeEntry(entry: AuditEntry): void {
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
    } else {
      this.logger.warn(`Audit: ${entry.eventType} (failed)`, {
        ...logContext,
        error: entry.error,
      });
    }
  }

  /**
   * Record tool invocation start
   */
  recordToolInvocation(
    toolName: string,
    input: unknown,
    metadata?: Record<string, unknown>
  ): string {
    const entry: AuditEntry = {
      id: generateAuditId(),
      correlationId: this.correlationId,
      timestamp: new Date().toISOString(),
      eventType: "tool_invocation",
      toolName,
      success: true,
      input: this.processInput(input) as Record<string, unknown>,
      metadata,
    };

    this.storeEntry(entry);
    return entry.id;
  }

  /**
   * Record tool success
   */
  recordToolSuccess(
    auditId: string,
    toolName: string,
    output: unknown,
    durationMs: number,
    metadata?: Record<string, unknown>
  ): void {
    const entry: AuditEntry = {
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
  recordToolError(
    auditId: string,
    toolName: string,
    error: { code: string; message: string },
    durationMs: number,
    metadata?: Record<string, unknown>
  ): void {
    const entry: AuditEntry = {
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
  recordValidationError(
    toolName: string,
    validationErrors: string[],
    input: unknown
  ): void {
    const entry: AuditEntry = {
      id: generateAuditId(),
      correlationId: this.correlationId,
      timestamp: new Date().toISOString(),
      eventType: "validation_error",
      toolName,
      success: false,
      input: this.processInput(input) as Record<string, unknown>,
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
  recordSecurityViolation(
    type: string,
    details: Record<string, unknown>
  ): void {
    const entry: AuditEntry = {
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
export function getRecentAuditEntries(
  limit: number = 100
): readonly AuditEntry[] {
  return auditStore.slice(-limit);
}

/**
 * Get audit entries by correlation ID
 */
export function getAuditEntriesByCorrelationId(
  correlationId: string
): readonly AuditEntry[] {
  return auditStore.filter((entry) => entry.correlationId === correlationId);
}

/**
 * Get audit entries by tool name
 */
export function getAuditEntriesByTool(
  toolName: string,
  limit: number = 100
): readonly AuditEntry[] {
  return auditStore
    .filter((entry) => entry.toolName === toolName)
    .slice(-limit);
}

/**
 * Clear audit store (for testing)
 */
export function clearAuditStore(): void {
  auditStore.length = 0;
}

/**
 * Create a new audit trail for a request
 */
export function createAuditTrail(correlationId?: string): AuditTrail {
  return new AuditTrail(correlationId);
}
