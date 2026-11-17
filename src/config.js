import fs from "fs";
import os from "os";
import path from "path";

const configDir = path.join(os.homedir(), ".my-ai-code");
const configFile = path.join(configDir, "config.json");

export const DEFAULT_MODEL = "gemini-1.5-flash";
export const AVAILABLE_MODELS = [
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-2.0-flash"
];

function readConfigFile() {
  if (!fs.existsSync(configFile)) {
    return {};
  }
  try {
    const raw = fs.readFileSync(configFile, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function writeConfigFile(data) {
  fs.mkdirSync(configDir, { recursive: true });
  fs.writeFileSync(configFile, JSON.stringify(data, null, 2), {
    encoding: "utf8",
    mode: 0o600
  });
}

export function saveApiKey(apiKey) {
  if (!apiKey || !apiKey.trim()) {
    throw new Error("API key is required.");
  }
  const config = readConfigFile();
  config.apiKey = apiKey.trim();
  writeConfigFile(config);
}

export function saveModel(model) {
  if (!model || !model.trim()) {
    throw new Error("Model name is required.");
  }
  const config = readConfigFile();
  config.model = model.trim();
  writeConfigFile(config);
}

export function saveConfig({ apiKey, model }) {
  const config = readConfigFile();
  if (apiKey !== undefined && apiKey.trim()) {
    config.apiKey = apiKey.trim();
  }
  if (model !== undefined && model.trim()) {
    config.model = model.trim();
  }
  writeConfigFile(config);
}

export function getApiKey() {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) {
    return process.env.GEMINI_API_KEY.trim();
  }
  const config = readConfigFile();
  return config.apiKey ? config.apiKey.trim() : null;
}

export function getModel() {
  if (process.env.GEMINI_MODEL && process.env.GEMINI_MODEL.trim()) {
    return process.env.GEMINI_MODEL.trim();
  }
  const config = readConfigFile();
  return config.model ? config.model.trim() : DEFAULT_MODEL;
}

export function getConfig() {
  const config = readConfigFile();
  return {
    apiKey: getApiKey(),
    savedApiKey: config.apiKey ? config.apiKey.trim() : null,
    model: getModel(),
    configFile
  };
}

export function clearConfig() {
  if (fs.existsSync(configFile)) {
    fs.unlinkSync(configFile);
    return true;
  }
  return false;
}
