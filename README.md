# LLM Workbench

LLM Workbench is a user-friendly web interface designed for large language models, built with React and MobX, styled using Shadcn UI. It serves as a one-stop solution for all your large language model needs, enabling you to harness the power of free, open-source language models on your local machine.

### Getting Started

To start your journey, choose between a HuggingFace Text Inference Generation Endpoint or Ollama.

#### HuggingFace Text Inference Generation Endpoint

```bash
docker run --gpus all --shm-size 1g -p 8080:80 -v (pwd)/models:/data ghcr.io/huggingface/text-generation-inference:1.1.0 --trust-remote-code --model-id TheBloke/deepseek-coder-33B-instruct-AWQ --quantize awq
```

#### Ollama

```bash
OLLAMA_ORIGINS="https://knoopx.github.io" ollama serve
```

or add this line to `/etc/systemd/system/ollama.service`:

```bash
Environment=OLLAMA_ORIGINS="https://knoopx.github.io"
```

Restart Ollama using these commands:

```bash
systemctl daemon-reload
systemctl restart ollama
```

## 🎭 Features

### 💬 Chat Interface

- **Simple, clean interface**: We've designed a user-friendly interface that makes it easy for you to interact with the AI model.
- **Output streaming**: See the generated text in real-time as you type your prompt.
- **Regenerate/Continue/Undo/Clear**: Use these buttons to control the generation process.
- **Markdown Rendering**: The AI will generate text that supports Markdown formatting, making it easy for you to create styled content.
- **Generation canceling**: Stop the generation process at any time by clicking the "Cancel" button.
- **Dark mode**: Prefer working in the dark? Toggle on Dark mode for a more comfortable experience.
- **Attachments**: Attach files to your chat messages (pdf, docx, and plain-text supported only).

### 🛹 Playground

- **Copilot-alike inline completion**: Type your prompt and let the AI suggest completions as you type.
- **Tab to accept**: Press the Tab key to accept the suggested completion.
- **Cltr+Enter to re-generate**: Hit Ctrl+Enter to re-generate the response with the same prompt.

### 🤖 Agents

- **Connection Adapters**: We support various connection adapters, including Ollama and HuggingFace TGI (local or remote).
- **Complete generation control**: Customize the agent behavior with system prompts, conversation history, and chat prompt templates using [liquidjs](https://liquidjs.com/).

# Future Ideas

- Import/Export chats - Importing and exporting chat data for convenience.
- Token Counter - A feature to count tokens in text.
- Copy fenced block to clipboard - The ability to copy a code block and paste it into the clipboard.
- Collapsible side panels - Side panels that can be expanded or collapsed for better organization.
- [window.ai](https://windowai.io/) integration

Code Interpreters:

- Hugging Face agents ([@huggingface/agents](https://github.com/huggingface/agents))
- Aider ([paul-gauthier/aider](https://github.com/paul-gauthier/aider))
- Functionary ([MeetKai/functionary](https://github.com/MeetKai/functionary))
- NexusRaven model ([Nexusflow/NexusRaven-13B](https://huggingface.co/Nexusflow/NexusRaven-13B))
- Open procedures database ([KillianLucas/open-procedures](https://raw.githubusercontent.com/KillianLucas/open-procedures/main/procedures_db.json))
- ReACT ([www.promptingguide.ai/techniques/react](https://www.promptingguide.ai/techniques/react))

Model management features:

- Hugging Face Hub ([@huggingface/hub](https://huggingface.co/docs/huggingface.js/hub/modules))
- GPT4All catalog ([nomic-ai/gpt4all](https://raw.githubusercontent.com/nomic-ai/gpt4all/main/gpt4all-chat/metadata/models2.json))
- LM Studio catalog [lmstudio-ai/model-catalog](https://raw.githubusercontent.com/lmstudio-ai/model-catalog/main/catalog.json)

RAG, embeddings and vector search:

- Client vector search ([yusufhilmi/client-vector-search](https://github.com/yusufhilmi/client-vector-search)) - in-browser vector database.
- Fully local PDF chatbot ([jacoblee93/fully-local-pdf-chatbot](https://github.com/jacoblee93/fully-local-pdf-chatbot)) - related.
- SemanticFinder ([do-me.github.io/SemanticFinder](https://do-me.github.io/SemanticFinder/)) - related.

Other potential pipelines to consider:

- TTS (Text-to-Speech) - convert text into speech.
- Reformatting - such as punctuation and re-punctuation models ([ldenoue/distilbert-base-re-punctuate](https://huggingface.co/ldenoue/distilbert-base-re-punctuate)).
- Summarization - summarize long text into shorter versions ([ldenoue/distilbart-cnn-6-6](https://huggingface.co/ldenoue/distilbart-cnn-6-6)).
- Translation - convert text between languages.
- Automatic speech recognition pipeline ([transformers.js](https://huggingface.co/docs/transformers.js/api/pipelines#pipelinesautomaticspeechrecognitionpipeline)) - convert spoken words into written text.
- Named Entity Recognition (NER) - identify and classify entities in text ([Xenova/bert-base-NER](https://huggingface.co/Xenova/bert-base-NER), [wink-nlp](https://winkjs.org/wink-nlp/wink-nlp-in-browsers.html)).
