import { GoogleGenerativeAI } from "@google/generative-ai";
import { getApiKey } from "./config.js";

export async function askAI(question) {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error(
      "No API key found. Run: my-ai-code config"
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction:
      "You are an expert programming assistant. " +
      "Give accurate, practical coding answers. " +
      "Use Markdown code blocks for code. " +
      "Explain important parts briefly."
  });

  const result = await model.generateContent(question);
  return result.response.text();
}
