export const DEFAULT_AGENTS = [
  {
    id: "HuggingFaceH4/zephyr-7b-beta",
    name: "Zephyr 7B β",
    adapter: {
      baseUrl: "HuggingFaceH4/zephyr-7b-beta",
      type: "HuggingFace",
    },
    parameters: {
      temperature: 0.7,
      top_k: 40,
      top_p: 0.9,
      repeat_last_n: -1,
      repeat_penalty: 1.18,
      num_predict: -2,
      num_ctx: 4096,
      stop: ["</s>", "<|system|>", "<|user|>", "<|assistant|>"],
    },
    checkedOptions: ["num_ctx", "stop"],
    promptTemplate:
      '{%- for message in messages -%}\n{% include "message" %}\n{% endfor -%}\n<|assistant|>\n',
    messages: [
      {
        role: "system",
        content:
          "You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe.  Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature.\n\nIf a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.",
      },
    ],
    templates: [
      {
        id: "message",
        content:
          "<|{{message.role}}|>\n{{message.content}}{%if message.closed%}</s>{%endif%}",
      },
    ],
  },
]
