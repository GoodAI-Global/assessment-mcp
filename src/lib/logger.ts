/**
 * Good AI Enterprise Logger
 * Structured logging with JSON and pretty output formats
 */

import { getConfig, type LogLevel } from "./config.js";

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

/** Log level priority (lower = more verbose) */
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  silent: 4,
};

/** ANSI color codes for pretty output */
const COLORS = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
};

/**
 * Format log entry for JSON output
 */
function formatJson(entry: LogEntry): string {
  return JSON.stringify(entry);
}

/**
 * Format log entry for pretty console output
 */
function formatPretty(entry: LogEntry): string {
  const levelColors: Record<LogLevel, string> = {
    debug: COLORS.gray,
    info: COLORS.blue,
    warn: COLORS.yellow,
    error: COLORS.red,
    silent: "",
  };

  const levelColor = levelColors[entry.level] || "";
  const levelStr = `[${entry.level.toUpperCase().padEnd(5)}]`;
  const timestamp = COLORS.dim + entry.timestamp + COLORS.reset;
  const correlationStr = entry.correlationId
    ? ` ${COLORS.cyan}[${entry.correlationId}]${COLORS.reset}`
    : "";

  let output = `${timestamp} ${levelColor}${levelStr}${COLORS.reset}${correlationStr} ${entry.message}`;

  if (entry.context && Object.keys(entry.context).length > 0) {
    output += ` ${COLORS.dim}${JSON.stringify(entry.context)}${COLORS.reset}`;
  }

  if (entry.error) {
    output += `\n${COLORS.red}  Error: ${entry.error.name}: ${entry.error.message}${COLORS.reset}`;
    if (entry.error.stack) {
      output += `\n${COLORS.dim}${entry.error.stack}${COLORS.reset}`;
    }
  }

  return output;
}

/**
 * Logger class with structured logging support
 */
export class Logger {
  private correlationId?: string;
  private defaultContext: Record<string, unknown>;

  constructor(correlationId?: string, defaultContext: Record<string, unknown> = {}) {
    this.correlationId = correlationId;
    this.defaultContext = defaultContext;
  }

  /**
   * Check if a log level should be output
   */
  private shouldLog(level: LogLevel): boolean {
    const config = getConfig();
    return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[config.logging.level];
  }

  /**
   * Create a log entry
   */
  private createEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): LogEntry {
    const config = getConfig();

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
    };

    if (this.correlationId) {
      entry.correlationId = this.correlationId;
    }

    const mergedContext = { ...this.defaultContext, ...context };
    if (Object.keys(mergedContext).length > 0) {
      entry.context = mergedContext;
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
      };
      if (config.logging.includeStackTraces && error.stack) {
        entry.error.stack = error.stack;
      }
    }

    return entry;
  }

  /**
   * Output a log entry
   */
  private output(entry: LogEntry): void {
    const config = getConfig();

    const formatted = config.logging.format === "json" ? formatJson(entry) : formatPretty(entry);

    // Use stderr to avoid interfering with MCP stdio transport
    if (entry.level === "error") {
      console.error(formatted);
    } else {
      console.error(formatted);
    }
  }

  /**
   * Log at debug level
   */
  debug(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog("debug")) {
      this.output(this.createEntry("debug", message, context));
    }
  }

  /**
   * Log at info level
   */
  info(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog("info")) {
      this.output(this.createEntry("info", message, context));
    }
  }

  /**
   * Log at warn level
   */
  warn(message: string, context?: Record<string, unknown>): void {
    if (this.shouldLog("warn")) {
      this.output(this.createEntry("warn", message, context));
    }
  }

  /**
   * Log at error level
   */
  error(message: string, error?: Error, context?: Record<string, unknown>): void {
    if (this.shouldLog("error")) {
      this.output(this.createEntry("error", message, context, error));
    }
  }

  /**
   * Create a child logger with additional context
   */
  child(context: Record<string, unknown>): Logger {
    return new Logger(this.correlationId, {
      ...this.defaultContext,
      ...context,
    });
  }

  /**
   * Create a child logger with a correlation ID
   */
  withCorrelationId(correlationId: string): Logger {
    return new Logger(correlationId, this.defaultContext);
  }
}

/** Default logger instance */
export const logger = new Logger();

/**
 * Generate a unique correlation ID
 */
export function generateCorrelationId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `${timestamp}-${random}`;
}

/**
 * Create a logger with a new correlation ID
 */
export function createRequestLogger(context?: Record<string, unknown>): Logger {
  const correlationId = generateCorrelationId();
  return new Logger(correlationId, context);
}
