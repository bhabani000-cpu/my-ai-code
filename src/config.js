import fs from "fs";
import os from "os";
import path from "path";

const configDir = path.join(os.homedir(), ".my-ai-code");
const configFile = path.join(configDir, "config.json");

export function saveApiKey(apiKey) {
  if (!apiKey || !apiKey.trim()) {
    throw new Error("API key is required.");
  }

  const cleanKey = apiKey.trim();

  fs.mkdirSync(configDir, { recursive: true });

  fs.writeFileSync(
    configFile,
    JSON.stringify({ apiKey: cleanKey }, null, 2),
    {
      encoding: "utf8",
      mode: 0o600
    }
  );
}

export function getApiKey() {
  if (process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY.trim();
  }

  if (!fs.existsSync(configFile)) {
    return null;
  }

  try {
    const config = JSON.parse(
      fs.readFileSync(configFile, "utf8")
    );
    return config.apiKey ? config.apiKey.trim() : null;
  } catch {
    return null;
  }
}
