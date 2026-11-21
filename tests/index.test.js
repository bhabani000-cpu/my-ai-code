import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_MODEL,
  AVAILABLE_MODELS,
  getConfig,
  saveApiKey,
  saveModel,
  clearConfig,
  getApiKey,
  getModel
} from "../src/config.js";
import { formatErrorMessage, SYSTEM_INSTRUCTION } from "../src/ai.js";

test("Config Module - defaults and validation", async (t) => {
  await t.test("should have default model defined", () => {
    assert.strictEqual(DEFAULT_MODEL, "gemini-1.5-flash");
    assert.ok(AVAILABLE_MODELS.includes("gemini-1.5-flash"));
    assert.ok(AVAILABLE_MODELS.includes("gemini-2.0-flash"));
  });

  await t.test("should reject empty API key", () => {
    assert.throws(() => saveApiKey(""), /API key is required/);
    assert.throws(() => saveApiKey("   "), /API key is required/);
  });

  await t.test("should reject empty Model", () => {
    assert.throws(() => saveModel(""), /Model name is required/);
    assert.throws(() => saveModel("   "), /Model name is required/);
  });

  await t.test("should return configuration object", () => {
    const config = getConfig();
    assert.ok(config);
    assert.ok("apiKey" in config);
    assert.ok("model" in config);
    assert.ok("configFile" in config);
  });
});

test("AI Module - error formatting and system instruction", async (t) => {
  await t.test("should format invalid API key error", () => {
    const err = new Error("API_KEY_INVALID: API key not valid");
    const formatted = formatErrorMessage(err);
    assert.ok(formatted.includes("Invalid Gemini API key"));
  });

  await t.test("should format rate limit error", () => {
    const err = new Error("RESOURCE_EXHAUSTED: quota exceeded 429");
    const formatted = formatErrorMessage(err);
    assert.ok(formatted.includes("rate limit or quota exceeded"));
  });

  await t.test("should format model not found error", () => {
    const err = new Error("models/gemini-unknown not found");
    const formatted = formatErrorMessage(err);
    assert.ok(formatted.includes("The specified model was not found"));
  });

  await t.test("should preserve generic error message", () => {
    const err = new Error("Network timeout");
    const formatted = formatErrorMessage(err);
    assert.strictEqual(formatted, "Network timeout");
  });

  await t.test("should have standard system instruction", () => {
    assert.ok(SYSTEM_INSTRUCTION.includes("AI coding assistant"));
    assert.ok(SYSTEM_INSTRUCTION.includes("production-ready"));
  });
});

test("Library Exports - index.js exports full public API", async () => {
  const index = await import("../src/index.js");
  assert.strictEqual(typeof index.askAI, "function");
  assert.strictEqual(typeof index.createChatSession, "function");
  assert.strictEqual(typeof index.getGenerativeModel, "function");
  assert.strictEqual(typeof index.formatErrorMessage, "function");
  assert.strictEqual(typeof index.saveApiKey, "function");
  assert.strictEqual(typeof index.saveModel, "function");
  assert.strictEqual(typeof index.getConfig, "function");
  assert.strictEqual(typeof index.clearConfig, "function");
  assert.strictEqual(typeof index.DEFAULT_MODEL, "string");
  assert.ok(Array.isArray(index.AVAILABLE_MODELS));
});
