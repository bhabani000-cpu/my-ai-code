# my-ai-code 🚀

An AI-powered terminal coding assistant and reusable Node.js developer SDK that delivers instant, practical programming help directly inside your command line and your Node.js applications — powered by Google Gemini.

[![npm version](https://img.shields.io/npm/v/@bhabani0_0/my-ai-code.svg)](https://www.npmjs.com/package/@bhabani0_0/my-ai-code)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js CI](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)

---

## 💡 Why It Is Useful

Developers constantly switch contexts between code editors, browser search tabs, and AI web interfaces while programming or debugging terminal workflows. 

`my-ai-code` solves this friction by providing:
- **Zero-Context-Switching in CLI**: Ask questions, analyze code, and pipe terminal outputs (`git diff`, stack traces, test errors) directly to Gemini from the CLI.
- **Reusable Node.js Library**: Import the streaming AI engine into your own Node.js backends, bots, and CLI scripts without re-implementing Gemini initialization, history management, and error handling.
- **Persistent Secure Configuration**: Manages local API key encryption and model preferences in `~/.my-ai-code/config.json` with restricted Unix file permissions (`0600`).
- **Cost-Free Developer Workflow**: Utilizes the generous Google Gemini free tier.

---

## 📦 Installation

### Global CLI Installation
Install globally using `npm`:

```bash
npm install -g @bhabani0_0/my-ai-code
```

### Local Library Installation
Or install as a dependency inside your Node.js project:

```bash
npm install @bhabani0_0/my-ai-code
```

---

## 🔑 Configuration

Before using `my-ai-code`, set up your free Google Gemini API key:

1. **Get your free API key:**  
   Visit [Google AI Studio](https://aistudio.google.com/app/apikey) and click **Create API key**.

2. **Configure the CLI:**  
   Run the following command in your terminal:

   ```bash
   my-ai-code config
   ```

   Follow the prompts to save your API key and choose your default model (e.g. `gemini-1.5-flash`, `gemini-1.5-pro`, or `gemini-2.0-flash`).

### Configuration Shortcuts

```bash
# View current configuration status
my-ai-code config --show

# Set API key directly
my-ai-code config --key <YOUR_API_KEY>

# Set default model directly
my-ai-code config --model gemini-1.5-flash

# Clear saved configuration
my-ai-code config --clear
```

> **Tip:** You can also supply your key via the `GEMINI_API_KEY` environment variable without saving it.

---

## 💡 Usage

### 1. Interactive Multi-Turn Chat Mode

Run `my-ai-code` without arguments to enter interactive mode with **full conversation memory**:

```bash
my-ai-code
```

```text
╭──────────────────────────────────────────╮
│                MY AI CODE                │
│      Terminal AI Coding Assistant        │
╰──────────────────────────────────────────╯

Model: gemini-1.5-flash
Type your coding question. Press Enter to send.
Commands: /clear (reset chat), /help, or type 'exit' to quit.

You: How do I create an Express route that accepts POST requests?
AI: [Streams answer in real-time...]

You: Can you add input validation using Zod to that route?
AI: [Remembers the previous route and adds validation!]
```

#### In-Chat Commands:
- `/clear` – Reset conversation history and start fresh
- `/history` – Check number of exchanged turns in current session
- `/model` – Check the currently active model
- `/help` – Show list of available commands
- `exit` or `quit` – Exit the interactive chat

---

### 2. Quick One-Shot Question

Ask questions directly from your terminal with instant word-by-word streaming:

```bash
my-ai-code "explain async/await in JavaScript"
```

Quotes are optional for simple questions:
```bash
my-ai-code how to center a div in CSS
```

---

### 3. File Context (`-f, --file`)

Pass a source file to analyze, explain, or debug:

```bash
my-ai-code -f src/server.js "find potential memory leaks and optimize this code"
```

```bash
my-ai-code -f package.json "which dependencies might be vulnerable or outdated?"
```

---

### 4. Unix Piping / Stdin Support

Pipe compiler errors, logs, or git diffs directly into `my-ai-code`:

```bash
# Review git changes before committing
git diff | my-ai-code "generate a conventional commit message for these changes"

# Troubleshoot build or test errors
npm test 2>&1 | my-ai-code "explain why these tests failed and how to fix them"
```

---

### 5. Custom Model Selection (`-m, --model`)

Choose a specific model on the fly:

```bash
my-ai-code -m gemini-1.5-pro "design a distributed caching architecture"
```

---

## 📋 Features

- ⚡ **Real-Time Token Streaming**: Watch responses generate word-by-word with zero waiting.
- 💬 **Stateful Multi-Turn Chat**: Full conversation memory in interactive mode.
- 📁 **File & Pipe Integration**: Directly pass files (`-f`) or pipe terminal outputs (`cat`, `git diff`).
- 🤖 **Multiple Gemini Models**: Seamlessly switch between `gemini-1.5-flash`, `gemini-1.5-pro`, and `gemini-2.0-flash`.
- ⏳ **Visual Feedback**: Sleek terminal spinner powered by Ora.
- 🔒 **Secure**: API keys stored in user home directory (`~/.my-ai-code/config.json`) with restricted permissions (`0600`).
- 🆓 **Free AI Powered**: Works with free-tier Google Gemini API keys.

---

## 💻 Programmatic Node.js API

You can import and use `@bhabani0_0/my-ai-code` directly in your JavaScript / TypeScript projects.

### 1. Simple One-Shot Query (`askAI`)

```javascript
import { askAI } from "@bhabani0_0/my-ai-code";

// Basic question
const answer = await askAI("Write a helper function to debounce events in TypeScript");
console.log(answer);

// Query with code context and real-time streaming
await askAI("Optimize this algorithm", {
  context: "function slowSearch(arr, target) { return arr.indexOf(target); }",
  model: "gemini-1.5-flash",
  stream: true,
  onChunk: (chunk) => process.stdout.write(chunk)
});
```

#### Parameters for `askAI(question, options)`:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `question` | `string` | **Yes** | — | The query or prompt sent to Gemini |
| `options.context` | `string` | No | `""` | Source code or error trace context |
| `options.model` | `string` | No | Configured model (`gemini-1.5-flash`) | Gemini model to invoke |
| `options.stream` | `boolean` | No | `false` | Enable token streaming |
| `options.onChunk` | `function` | No | `undefined` | Callback invoked with `(chunkText)` per stream packet |

#### Return Value:
- `Promise<string>`: The complete response string returned by Gemini.

---

### 2. Multi-Turn Stateful Chat (`createChatSession`)

```javascript
import { createChatSession } from "@bhabani0_0/my-ai-code";

const session = createChatSession({ model: "gemini-1.5-flash" });

// Turn 1
const reply1 = await session.sendMessage("How do I connect to MongoDB using Mongoose?");
console.log("AI:", reply1);

// Turn 2: Preserves full conversational context
const reply2 = await session.sendMessage("Now show how to define a schema for a User model.");
console.log("AI:", reply2);
```

#### Parameters for `createChatSession(options)`:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `options.model` | `string` | No | Configured default | Gemini model name |
| `options.history` | `Array` | No | `[]` | Initial chat turn history array |

#### Session Methods:
- `sendMessage(message, { onChunk })`: Sends a user message and returns `Promise<string>`. Optional `onChunk` callback for streaming chunks.

---

### 3. Configuration Management

```javascript
import { getConfig, saveApiKey, saveModel, clearConfig } from "@bhabani0_0/my-ai-code";

// Inspect current settings
const config = getConfig();
console.log("Configured model:", config.model);

// Update settings programmatically
saveApiKey("AIzaSyYourSecretKey...");
saveModel("gemini-1.5-pro");

// Reset saved settings
clearConfig();
```

---

## 🧪 Testing

The package includes automated tests built with Node.js's native test runner (`node --test`).

Run tests:
```bash
npm test
```

---

## ⚠️ Limitations

- **Internet Connectivity**: An active internet connection is required to communicate with Google Gemini APIs.
- **API Key**: Requires a valid Google Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
- **Free Tier Quota**: Subject to Google Gemini's free tier rate limits (e.g. 15 RPM for standard models). When hit, the package throws a clean quota explanation.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository: [https://github.com/bhabani000-cpu/my-ai-code](https://github.com/bhabani000-cpu/my-ai-code)
2. Create your feature branch: `git checkout -b feature/awesome-feature`
3. Ensure all tests pass: `npm test`
4. Commit your changes: `git commit -m "feat: add awesome feature"`
5. Push to the branch: `git push origin feature/awesome-feature`
6. Open a Pull Request

---

## 📄 License

MIT
