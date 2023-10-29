import { types as t } from "mobx-state-tree"

export const Preset = t.model("Preset", {
  key: t.string,
  value: t.frozen(),
})

export const INFERENCE_PRESETS = {
  "LLaMA Precise": {
    temperature: 0.7,
    top_k: 40,
    top_p: 0.1,
    repeat_penalty: 1.18,
  },
  Shortwave: {
    temperature: 1.53,
    top_k: 33,
    top_p: 0.64,
    repeat_penalty: 1.07,
  },
  "Space Alien": {
    temperature: 1.31,
    top_k: 72,
    top_p: 0.29,
    repeat_penalty: 1.09,
  },
  "Star Chat": {
    temperature: 0.2,
    top_k: 50,
    top_p: 0.95,
    repeat_penalty: 1.0,
  },
  Yara: {
    temperature: 0.82,
    top_k: 72,
    top_p: 0.21,
    repeat_penalty: 1.19,
  },
  "Big-O": {
    temperature: 0.87,
    top_k: 85,
    top_p: 0.99,
    repeat_penalty: 1.01,
  },
}

export const CHAT_TEMPLATES = {
  ChatML: `{{#messages}}
<|im_start|>{{role}}
{{content}}{{#closed}}<|im_end|>{{/closed}}
{{/messages}}`,

  Vicuna: `A chat between a curious user and an artificial intelligence assistant. The assistant gives helpful, detailed, and polite answers to the user's questions.
{{#messages}}
{{#upperCase}}{{role}}{{/upperCase}}: {{content}}
{{/messages}}`,

  "Alpaca Instruct": `Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.

### Instruction:
{{prompt}}

### Response:`,
}

export const Presets = t.model("Presets", {
  system: t.array(Preset),
  user: t.array(Preset),
  chat: t.optional(t.array(Preset), transform(CHAT_TEMPLATES)),
  inference: t.optional(t.array(Preset), transform(INFERENCE_PRESETS)),
})

function transform(what: any) {
  return Object.keys(what).map((key) => ({
    key,
    value: what[key],
  }))
}
