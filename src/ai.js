import { GoogleGenerativeAI } from "@google/generative-ai";
import { getApiKey, getModel, DEFAULT_MODEL } from "./config.js";

export const SYSTEM_INSTRUCTION =
  "You are an expert, practical AI coding assistant for developers using the terminal.\n" +
  "- Provide accurate, modern, and production-ready code.\n" +
  "- Keep explanations concise, practical, and focused on solutions.\n" +
  "- Use Markdown code blocks with appropriate language tags for code snippets.\n" +
  "- When reviewing code or diagnosing bugs, identify the root cause and provide clear fixes.";

export function formatErrorMessage(error) {
  const msg = error?.message || String(error);

  if (msg.includes("API key not valid") || msg.includes("API_KEY_INVALID")) {
    return "Invalid Gemini API key. Please reconfigure with: my-ai-code config";
  }
  if (msg.includes("RESOURCE_EXHAUSTED") || msg.includes("429")) {
    return "Gemini API rate limit or quota exceeded. Please wait a moment before trying again.";
  }
  if (msg.includes("models/") && msg.includes("not found")) {
    return `The specified model was not found. Please try a supported model such as "${DEFAULT_MODEL}".`;
  }
  return msg;
}

export function getGenerativeModel(customModel) {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error("No API key found. Run: my-ai-code config");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelName = customModel || getModel() || DEFAULT_MODEL;

  return genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: SYSTEM_INSTRUCTION
  });
}

export async function askAI(question, options = {}) {
  const { model, context, stream = false, onChunk } = options;

  let fullPrompt = question;
  if (context && context.trim()) {
    fullPrompt = `[Context / Code]:\n\`\`\`\n${context.trim()}\n\`\`\`\n\n[Instruction / Question]:\n${question}`;
  }

  const generativeModel = getGenerativeModel(model);

  if (stream && typeof onChunk === "function") {
    try {
      const responseStream = await generativeModel.generateContentStream(fullPrompt);
      let fullText = "";
      for await (const chunk of responseStream.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        onChunk(chunkText);
      }
      return fullText;
    } catch (error) {
      throw new Error(formatErrorMessage(error));
    }
  }

  try {
    const result = await generativeModel.generateContent(fullPrompt);
    return result.response.text();
  } catch (error) {
    throw new Error(formatErrorMessage(error));
  }
}

export function createChatSession(options = {}) {
  const generativeModel = getGenerativeModel(options.model);
  const chat = generativeModel.startChat({
    history: options.history || []
  });

  return {
    async sendMessage(message, { onChunk } = {}) {
      if (typeof onChunk === "function") {
        try {
          const resultStream = await chat.sendMessageStream(message);
          let fullText = "";
          for await (const chunk of resultStream.stream) {
            const chunkText = chunk.text();
            fullText += chunkText;
            onChunk(chunkText);
          }
          return fullText;
        } catch (error) {
          throw new Error(formatErrorMessage(error));
        }
      }

      try {
        const result = await chat.sendMessage(message);
        return result.response.text();
      } catch (error) {
        throw new Error(formatErrorMessage(error));
      }
    },
    async getHistory() {
      return await chat.getHistory();
    }
  };
}
