/**
 * Good AI Enterprise Logger
 * Structured logging with JSON and pretty output formats
 */
import { type LogLevel } from "./config.js";
/** Log entry structure */
export interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    correlationId?: string;
    context?: Record<string, unknown>;
    error?: {
        name: string;
        message: string;
        stack?: string;
    };
}
/**
 * Logger class with structured logging support
 */
export declare class Logger {
    private correlationId?;
    private defaultContext;
    constructor(correlationId?: string, defaultContext?: Record<string, unknown>);
    /**
     * Check if a log level should be output
     */
    private shouldLog;
    /**
     * Create a log entry
     */
    private createEntry;
    /**
     * Output a log entry
     */
    private output;
    /**
     * Log at debug level
     */
    debug(message: string, context?: Record<string, unknown>): void;
    /**
     * Log at info level
     */
    info(message: string, context?: Record<string, unknown>): void;
    /**
     * Log at warn level
     */
    warn(message: string, context?: Record<string, unknown>): void;
    /**
     * Log at error level
     */
    error(message: string, error?: Error, context?: Record<string, unknown>): void;
    /**
     * Create a child logger with additional context
     */
    child(context: Record<string, unknown>): Logger;
    /**
     * Create a child logger with a correlation ID
     */
    withCorrelationId(correlationId: string): Logger;
}
/** Default logger instance */
export declare const logger: Logger;
/**
 * Generate a unique correlation ID
 */
export declare function generateCorrelationId(): string;
/**
 * Create a logger with a new correlation ID
 */
export declare function createRequestLogger(context?: Record<string, unknown>): Logger;
//# sourceMappingURL=logger.d.ts.map