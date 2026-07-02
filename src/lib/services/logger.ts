type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: Record<string, unknown>;
  error?: Error;
}

const IS_PRODUCTION = process.env.NODE_ENV === "production";

function formatLog(entry: LogEntry): string {
  const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
  const suffix = entry.data ? ` | ${JSON.stringify(entry.data)}` : "";
  const errorSuffix = entry.error ? ` | ${entry.error.message}\n${entry.error.stack}` : "";
  return `${prefix} ${entry.message}${suffix}${errorSuffix}`;
}

class Logger {
  private log(level: LogLevel, message: string, data?: Record<string, unknown>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      error,
    };

    if (IS_PRODUCTION) {
      // In production, output structured JSON for log ingestion
      // eslint-disable-next-line no-console
      console[level === "error" ? "error" : level === "warn" ? "warn" : "log"](
        JSON.stringify(entry)
      );
    } else {
      // In development, output formatted text
      const formatted = formatLog(entry);
      switch (level) {
        case "error":
          console.error(formatted);
          break;
        case "warn":
          console.warn(formatted);
          break;
        default:
          console.log(formatted);
      }
    }
  }

  debug(message: string, data?: Record<string, unknown>) {
    this.log("debug", message, data);
  }

  info(message: string, data?: Record<string, unknown>) {
    this.log("info", message, data);
  }

  warn(message: string, data?: Record<string, unknown>) {
    this.log("warn", message, data);
  }

  error(message: string, error?: Error, data?: Record<string, unknown>) {
    this.log("error", message, data, error);
  }

  // ───────── Audit logging ─────────

  audit(action: string, userId: string, details?: Record<string, unknown>) {
    this.info(`[AUDIT] ${action}`, {
      userId,
      ...details,
      audit: true,
      timestamp: new Date().toISOString(),
    });
  }
}

export const logger = new Logger();
