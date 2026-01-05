/**
 * Good AI Enterprise Audit Trail
 * Comprehensive audit logging for compliance and observability
 */
/** Audit event types */
export type AuditEventType = "tool_invocation" | "tool_success" | "tool_error" | "validation_error" | "rate_limit" | "security_violation";
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
/**
 * Audit trail manager
 */
export declare class AuditTrail {
    private logger;
    private correlationId;
    constructor(correlationId?: string);
    /**
     * Get the correlation ID for this audit trail
     */
    getCorrelationId(): string;
    /**
     * Process input for audit logging
     */
    private processInput;
    /**
     * Process output for audit logging
     */
    private processOutput;
    /**
     * Store audit entry
     */
    private storeEntry;
    /**
     * Record tool invocation start
     */
    recordToolInvocation(toolName: string, input: unknown, metadata?: Record<string, unknown>): string;
    /**
     * Record tool success
     */
    recordToolSuccess(auditId: string, toolName: string, output: unknown, durationMs: number, metadata?: Record<string, unknown>): void;
    /**
     * Record tool error
     */
    recordToolError(auditId: string, toolName: string, error: {
        code: string;
        message: string;
    }, durationMs: number, metadata?: Record<string, unknown>): void;
    /**
     * Record validation error
     */
    recordValidationError(toolName: string, validationErrors: string[], input: unknown): void;
    /**
     * Record security violation
     */
    recordSecurityViolation(type: string, details: Record<string, unknown>): void;
}
/**
 * Get recent audit entries
 */
export declare function getRecentAuditEntries(limit?: number): readonly AuditEntry[];
/**
 * Get audit entries by correlation ID
 */
export declare function getAuditEntriesByCorrelationId(correlationId: string): readonly AuditEntry[];
/**
 * Get audit entries by tool name
 */
export declare function getAuditEntriesByTool(toolName: string, limit?: number): readonly AuditEntry[];
/**
 * Clear audit store (for testing)
 */
export declare function clearAuditStore(): void;
/**
 * Create a new audit trail for a request
 */
export declare function createAuditTrail(correlationId?: string): AuditTrail;
//# sourceMappingURL=audit.d.ts.map