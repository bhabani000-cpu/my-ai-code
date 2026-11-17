#!/usr/bin/env node

import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";

import { saveApiKey } from "../src/config.js";
import { askAI } from "../src/ai.js";
import { startChat } from "../src/chat.js";

const program = new Command();

program
  .name("my-ai-code")
  .description("AI coding assistant (Powered by free Gemini API)")
  .version("1.0.0");

program
  .command("config")
  .description("Configure your free Gemini API key")
  .action(async () => {
    console.log(
      chalk.cyan("\nGet a free API key here: https://aistudio.google.com/app/apikey\n")
    );
    const answers = await inquirer.prompt([
      {
        type: "password",
        name: "apiKey",
        message: "Enter your Google Gemini API key:",
        mask: "*"
      }
    ]);

    saveApiKey(answers.apiKey);

    console.log(
      chalk.green("\n✓ API key saved successfully.\n")
    );
  });

program
  .argument("[question]", "Coding question")
  .action(async (question) => {
    if (question) {
      try {
        const answer = await askAI(question);
        console.log("\n" + answer);
      } catch (error) {
        console.error(
          chalk.red(`\nError: ${error.message}\n`)
        );
      }

      return;
    }

    await startChat();
  });

program.parse();
