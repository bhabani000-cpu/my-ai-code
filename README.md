# my-ai-code 🚀

An AI-powered terminal coding assistant that delivers instant, practical programming help directly inside your command line interface — powered by Google Gemini.

---

## 📦 Installation

Install globally using `npm`:

```bash
npm install -g @bhabani0_0/my-ai-code
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

## 📄 License

MIT
