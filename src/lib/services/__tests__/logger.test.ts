import { describe, it, expect, vi, beforeEach } from "vitest";
import { logger } from "../logger";

describe("logger", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("logs debug messages", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.debug("test debug message");
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("[DEBUG]")
    );
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("test debug message")
    );
  });

  it("logs info messages", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.info("test info message");
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("[INFO]")
    );
  });

  it("logs warn messages", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    logger.warn("test warn message");
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("[WARN]")
    );
  });

  it("logs error messages with error object", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const error = new Error("test error");
    logger.error("test error message", error);
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("[ERROR]")
    );
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("test error message")
    );
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("test error")
    );
  });

  it("includes extra data when provided", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.info("message with data", { userId: "123", action: "test" });
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('"userId":"123"')
    );
  });

  it("creates audit log entries", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.audit("ORDER_CREATED", "user-123", { orderId: "order-456" });
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining("[AUDIT] ORDER_CREATED")
    );
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('"userId":"user-123"')
    );
  });
});
