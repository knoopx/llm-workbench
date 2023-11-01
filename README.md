# LLM Workbench

A one-stop-shop for all your LLM needs. Unleash the power of FOSS language models on your local machine.

# Usage

```bash
OLLAMA_ORIGINS="https://knoopx.github.io" ollama serve
```

or add to `/etc/systemd/system/ollama.service`:

```
Environment=OLLAMA_ORIGINS="https://knoopx.github.io"
```

and restart Ollama:

```
systemctl daemon-reload
systemctl restart ollama
```

# Features

- UI
  - Simple, clean interface
  - Dark mode
- LLM API Client
  - Ollama
- Chat Interface
  - Output Streaming
  - Regenerate/Continue/Undo/Clear
  - Markdown Rendering
- Complete generation control
  - System prompts
  - Conversation History
  - Chat prompt template

# Future Ideas

- window.ai integration
- Copy to clipboard overlay over messages
- Full page prompt editor
- Collapsible side panels
- Cancel generation
- Import/Export chats
- Some kind of Agents
- One-shot Tasks/Apps
- Tools
- LLM Connection adapters
- Prompt management
- Model management
- RAG/Embeddings/Vector Search
  - https://github.com/jacoblee93/fully-local-pdf-chatbot
    - https://github.com/tantaraio/voy
  - https://do-me.github.io/SemanticFinder/
  - https://github.com/yusufhilmi/client-vector-search
  - https://github.com/mwilliamson/mammoth.js
- Other pipelines
  - TTS
  - Re-formating
    - https://huggingface.co/ldenoue/distilbert-base-re-punctuate
  - Summarization
    - https://huggingface.co/ldenoue/distilbart-cnn-6-6
  - Translation
  - Speech Recognition
    - https://huggingface.co/docs/transformers.js/api/pipelines#pipelinesautomaticspeechrecognitionpipeline
  - NER
    - https://huggingface.co/Xenova/bert-base-NER
    - https://winkjs.org/wink-nlp/wink-nlp-in-browsers.html
