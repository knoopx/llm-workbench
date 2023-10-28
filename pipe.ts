import { stdout } from "process"
import { llmx } from "./src/lib/llmx"
import { ollama } from "./src/lib/ollama"

type State = { [k: string]: any }

function generate(
  key: string,
  model: string,
  options = {},
  stream: boolean = true,
) {
  return async ({ buffer, state }: { buffer: string; state: State }) => {
    console.log(buffer)
    const s = ollama(buffer, model, options)
    if (stream) {
      state[key] = s
      return stream
    }
    const text = s.text()
    state[key] = text
    return text
  }
}

function summarizeAgent(text: string, options = {}) {
  return llmx`${message(
    "system",
    "You are a summarization assistant. Given a user message, summarize it in a single sentence.",
  )}
${message("user", text)}
<|im_start|>assistant
${generate("response", "zephyr", options)}`
}

function message(role: string, text: string) {
  return `<|im_start|>${role}
${text}<|im_end|>`
}

function chat(text: string) {
  return llmx`${message(
    "system",
    "You are a friendly chatbot that speaks like a regular friend using common language.",
  )}
${message("user", text)}
<|im_start|>assistant
${generate("response", "zephyr", {}, false)}`
}

function chooseTool(text: string) {
  return llmx`${message(
    "system",
    "You are a friendly chatbot that speaks like a regular friend using common language.",
  )}`
}

const { state } = chat("Who is Debord?")
const answer = await state.response
console.log(answer)
const { stream } = summarizeAgent(answer, { maxTokens: 160 })
for await (const chunk of stream) {
  console.log(chunk)

  // stdout.write(chunk)
}

// for await (const chunk of state.stream) {
//   stdout.write(chunk);
// }

// console.log(state.response);
