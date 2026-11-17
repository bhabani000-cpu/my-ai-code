#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import ora from "ora";

import {
  saveConfig,
  saveApiKey,
  saveModel,
  getConfig,
  clearConfig,
  DEFAULT_MODEL,
  AVAILABLE_MODELS
} from "../src/config.js";
import { askAI } from "../src/ai.js";
import { startChat } from "../src/chat.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../package.json"), "utf8")
);

const program = new Command();

program
  .name("my-ai-code")
  .description("AI coding assistant for your terminal (Powered by Google Gemini)")
  .version(packageJson.version);

program
  .command("config")
  .description("Configure your Google Gemini API key and default model")
  .option("-s, --show", "Show current configuration")
  .option("-c, --clear", "Clear saved configuration")
  .option("-k, --key <key>", "Set API key directly")
  .option("-m, --model <model>", "Set default model directly")
  .action(async (options) => {
    if (options.clear) {
      const deleted = clearConfig();
      if (deleted) {
        console.log(chalk.green("\n✓ Configuration cleared successfully.\n"));
      } else {
        console.log(chalk.gray("\nNo saved configuration found.\n"));
      }
      return;
    }

    if (options.show) {
      const conf = getConfig();
      console.log(chalk.cyan("\nCurrent Configuration:"));
      console.log(`  Config File: ${chalk.gray(conf.configFile)}`);
      console.log(
        `  API Key:     ${
          conf.apiKey
            ? chalk.green(`✓ Configured (${conf.apiKey.slice(0, 4)}...${conf.apiKey.slice(-4)})`)
            : chalk.red("✗ Not configured")
        }`
      );
      console.log(`  Model:       ${chalk.cyan(conf.model)}\n`);
      return;
    }

    if (options.key) {
      saveApiKey(options.key);
      console.log(chalk.green("\n✓ API key saved successfully.\n"));
    }

    if (options.model) {
      saveModel(options.model);
      console.log(chalk.green(`\n✓ Default model set to "${options.model}".\n`));
    }

    if (options.key || options.model) {
      return;
    }

    console.log(
      chalk.cyan("\nGet a free API key here: https://aistudio.google.com/app/apikey\n")
    );

    const currentConfig = getConfig();

    const answers = await inquirer.prompt([
      {
        type: "password",
        name: "apiKey",
        message: "Enter your Google Gemini API key:",
        default: currentConfig.savedApiKey || undefined,
        mask: "*"
      },
      {
        type: "list",
        name: "model",
        message: "Choose your default Gemini model:",
        choices: AVAILABLE_MODELS,
        default: currentConfig.model || DEFAULT_MODEL
      }
    ]);

    saveConfig({
      apiKey: answers.apiKey,
      model: answers.model
    });

    console.log(chalk.green("\n✓ Configuration saved successfully.\n"));
  });

function readPipedStdin() {
  if (process.stdin.isTTY) {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      data += chunk;
    });
    process.stdin.on("end", () => {
      resolve(data.trim() ? data : null);
    });
    process.stdin.on("error", () => {
      resolve(null);
    });
  });
}

program
  .argument("[question...]", "Coding question to ask")
  .option("-f, --file <filePath>", "Attach a file as code context")
  .option("-m, --model <modelName>", "Specify Gemini model to use")
  .option("--no-stream", "Disable streaming output")
  .action(async (questionParts, options) => {
    const pipedData = await readPipedStdin();
    const questionText = Array.isArray(questionParts)
      ? questionParts.join(" ").trim()
      : (questionParts || "").trim();

    // If no question and no piped data, launch interactive chat
    if (!questionText && !pipedData) {
      await startChat({ model: options.model });
      return;
    }

    let context = "";

    // If file option is provided, read it
    if (options.file) {
      try {
        const filePath = path.resolve(process.cwd(), options.file);
        if (!fs.existsSync(filePath)) {
          console.error(chalk.red(`\nError: File not found: ${options.file}\n`));
          process.exit(1);
        }
        const fileContent = fs.readFileSync(filePath, "utf8");
        context = `File: ${options.file}\n\n${fileContent}`;
      } catch (err) {
        console.error(chalk.red(`\nError reading file: ${err.message}\n`));
        process.exit(1);
      }
    }

    // If stdin piped data is provided, append it to context
    if (pipedData) {
      if (context) {
        context += `\n\nPiped Stdin:\n${pipedData}`;
      } else {
        context = pipedData;
      }
    }

    const prompt = questionText || "Analyze this code and explain it or provide suggestions.";

    const spinner = ora({
      text: chalk.yellow("Thinking..."),
      spinner: "dots"
    }).start();

    let startedStreaming = false;

    try {
      if (options.stream) {
        await askAI(prompt, {
          model: options.model,
          context,
          stream: true,
          onChunk: (chunk) => {
            if (!startedStreaming) {
              spinner.stop();
              startedStreaming = true;
            }
            process.stdout.write(chunk);
          }
        });
        if (!startedStreaming) {
          spinner.stop();
        }
        console.log();
      } else {
        const answer = await askAI(prompt, {
          model: options.model,
          context,
          stream: false
        });
        spinner.stop();
        console.log("\n" + answer);
      }
    } catch (error) {
      spinner.stop();
      console.error(chalk.red(`\nError: ${error.message}\n`));
      process.exit(1);
    }
  });

program.parse();
