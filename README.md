# my-ai-code 🚀

An AI-powered terminal coding assistant that delivers instant, practical programming help directly inside your command line interface.

---

## 📦 Installation

Install globally using `npm`:

```bash
npm install -g my-ai-code
```

---

## 🔑 Configuration (Adding API Keys)

Before using `my-ai-code`, set up your free Google Gemini API key.

1. **Get your free API key:**  
   Visit [Google AI Studio](https://aistudio.google.com/app/apikey) and click **Create API key**.

2. **Configure the CLI:**  
   Run the following command in your terminal:

   ```bash
   my-ai-code config
   ```

3. Paste your API key when prompted.

Your key will be securely saved locally in `~/.my-ai-code/config.json`.

---

## 💡 Usage

### 1. Interactive Chatbot Mode

Run `my-ai-code` without arguments to enter interactive mode:

```bash
my-ai-code
```

```text
╭────────────────────────────╮
│        MY AI CODE          │
╰────────────────────────────╯

Type your coding question.
Type 'exit' to quit.

You: How do I create a REST API with Express?
```

### 2. Quick One-Command Question

Ask questions directly from your terminal:

```bash
my-ai-code "explain async await in JavaScript"
```

```bash
my-ai-code "create a React login component using Tailwind CSS"
```

---

## 📋 Features

- ⚡ **Instant Answers**: Get concise, accurate code snippets and explanations.
- 🆓 **Free AI Powered**: Powered by Google Gemini API.
- 🔒 **Secure**: API keys stored locally in user home directory with restricted permissions.
- 🎨 **Beautiful CLI**: Clean interface built with Chalk and Commander.

---

## 📄 License

MIT

