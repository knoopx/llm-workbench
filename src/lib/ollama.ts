import { Stream } from "./llmx"

const ENDPOINT = "http://127.0.0.1:11434/api/generate"

type GenerateOptions = {
  stop?: string
  seed?: number
  temperature?: number
  top_k?: number
  top_p?: number
  repeat_penalty?: number
  num_predict?: number
  num_ctx?: number
}

function call(prompt: string, model: string, options?: GenerateOptions) {
  return fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      model,
      stream: true,
      template: "{{ .Prompt }}",
      options,
    }),
  })
}

export function ollamaStream(
  prompt: string,
  model: string,
  options?: GenerateOptions,
): Stream {
  return new Stream({
    async start(controller) {
      const response = await call(prompt, model, options)

      if (!response.ok || !response.body) {
        throw new Error(
          `Failed to generate: ${response.status} ${await response.text()}`,
        )
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        const str = decoder.decode(value)
        const json = JSON.parse(str)

        if (done || json.done) {
          break
        }
        controller.enqueue(json.response)
      }

      controller.close()
    },
  })
}

export async function* ollama(
  prompt: string,
  model: string,
  options?: GenerateOptions,
) {
  const response = await call(prompt, model, options)

  if (!response.ok || !response.body) {
    throw new Error(
      `Failed to generate: ${response.status} ${await response.text()}`,
    )
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    const str = decoder.decode(value)
    const json = JSON.parse(str)

    if (done || json.done) {
      break
    }
    yield json.response
  }
}
