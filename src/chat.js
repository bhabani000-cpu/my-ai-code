import readline from "readline";
import chalk from "chalk";
import { askAI } from "./ai.js";

export async function startChat() {
  console.log();
  console.log(chalk.cyan("╭────────────────────────────╮"));
  console.log(chalk.cyan("│        MY AI CODE          │"));
  console.log(chalk.cyan("╰────────────────────────────╯"));
  console.log();
  console.log(
    chalk.gray("Type your coding question.")
  );
  console.log(
    chalk.gray("Type 'exit' to quit.\n")
  );

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const askQuestion = () => {
    rl.question(
      chalk.green("You: "),
      async (question) => {
        if (question.trim().toLowerCase() === "exit") {
          rl.close();
          return;
        }

        if (!question.trim()) {
          askQuestion();
          return;
        }

        try {
          console.log(chalk.yellow("\nThinking...\n"));

          const answer = await askAI(question);

          console.log(chalk.white(answer));
          console.log();
        } catch (error) {
          console.error(
            chalk.red(`Error: ${error.message}\n`)
          );
        }

        askQuestion();
      }
    );
  };

  askQuestion();
}
