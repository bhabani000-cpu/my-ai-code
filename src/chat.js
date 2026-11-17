import readline from "readline";
import chalk from "chalk";
import ora from "ora";
import { createChatSession } from "./ai.js";
import { getModel, getApiKey } from "./config.js";

export async function startChat(options = {}) {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.error(
      chalk.red("\nError: No API key found. Run: my-ai-code config\n")
    );
    return;
  }

  const modelName = options.model || getModel();

  console.log();
  console.log(chalk.cyan("╭──────────────────────────────────────────╮"));
  console.log(chalk.cyan("│                MY AI CODE                │"));
  console.log(chalk.cyan("│      Terminal AI Coding Assistant        │"));
  console.log(chalk.cyan("╰──────────────────────────────────────────╯"));
  console.log();
  console.log(chalk.gray(`Model: ${chalk.bold(modelName)}`));
  console.log(chalk.gray("Type your coding question. Press Enter to send."));
  console.log(
    chalk.gray("Commands: /clear (reset chat), /help, or type 'exit' to quit.\n")
  );

  let chatSession;
  try {
    chatSession = createChatSession({ model: modelName });
  } catch (err) {
    console.error(chalk.red(`\nError: ${err.message}\n`));
    return;
  }

  let turnCount = 0;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.green("You: ")
  });

  const printHelp = () => {
    console.log(chalk.yellow("\nAvailable Commands:"));
    console.log(`  ${chalk.cyan("/clear")}   - Reset conversation history`);
    console.log(`  ${chalk.cyan("/history")} - Show turn count for this conversation`);
    console.log(`  ${chalk.cyan("/model")}   - Display active model`);
    console.log(`  ${chalk.cyan("/help")}    - Show this help message`);
    console.log(`  ${chalk.cyan("exit")}     - Quit interactive chat\n`);
  };

  rl.prompt();

  rl.on("line", async (line) => {
    const input = line.trim();

    if (!input) {
      rl.prompt();
      return;
    }

    if (input.toLowerCase() === "exit" || input.toLowerCase() === "quit") {
      console.log(chalk.gray("\nGoodbye!\n"));
      rl.close();
      return;
    }

    if (input === "/help") {
      printHelp();
      rl.prompt();
      return;
    }

    if (input === "/clear") {
      try {
        chatSession = createChatSession({ model: modelName });
        turnCount = 0;
        console.log(chalk.yellow("\n✓ Conversation history cleared.\n"));
      } catch (err) {
        console.error(chalk.red(`\nError: ${err.message}\n`));
      }
      rl.prompt();
      return;
    }

    if (input === "/history") {
      console.log(
        chalk.gray(`\nCurrent session has ${turnCount} exchanged message(s).\n`)
      );
      rl.prompt();
      return;
    }

    if (input === "/model") {
      console.log(chalk.gray(`\nCurrent active model: ${chalk.cyan(modelName)}\n`));
      rl.prompt();
      return;
    }

    const spinner = ora({
      text: chalk.yellow("Thinking..."),
      spinner: "dots"
    }).start();

    let startedStreaming = false;

    try {
      await chatSession.sendMessage(input, {
        onChunk: (chunk) => {
          if (!startedStreaming) {
            spinner.stop();
            process.stdout.write(chalk.cyan("AI: "));
            startedStreaming = true;
          }
          process.stdout.write(chunk);
        }
      });

      if (!startedStreaming) {
        spinner.stop();
      }

      turnCount++;
      console.log("\n");
    } catch (error) {
      spinner.stop();
      console.error(chalk.red(`\nError: ${error.message}\n`));
    }

    rl.prompt();
  });

  rl.on("close", () => {
    process.exit(0);
  });
}
