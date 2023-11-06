import { GenerationParams } from "@/store/Agent"
import { Instance } from "mobx-state-tree"

type OllamaCompletionRequestParams = {
  num_ctx?: number
  num_predict?: number
  repeat_last_n?: number
  repeat_penalty?: number
  seed?: number
  stop?: string[]
  temperature?: number
  top_k?: number
  top_p?: number
}

export class OllamaAdapter {
  baseUrl: string
  parameters = [
    "num_ctx",
    "num_predict",
    "repeat_last_n",
    "repeat_penalty",
    "seed",
    "stop",
    "temperature",
    "top_p",
    "top_k",
  ] as (keyof Instance<typeof GenerationParams>)[]

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async models() {
    const models = await fetch(`${this.baseUrl}/api/tags`)
    const result = await models.json()
    return result.models
  }

  async meta(modelName: string) {
    const options = await fetch(`${this.baseUrl}/api/show`, {
      method: "POST",
      body: JSON.stringify({
        name: modelName,
      }),
    })
    return await options.json()
  }

  async embed(prompt: string, model: string) {
    const embeddings = await fetch(`${this.baseUrl}/api/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, prompt }),
    })
    const res = await embeddings.json()
    return res.embedding
  }

  completionRequest(
    prompt: string,
    model: string,
    options?: OllamaCompletionRequestParams,
    signal?: AbortSignal,
  ) {
    return fetch(`${this.baseUrl}/api/generate`, {
      signal,
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

  async *completion(
    prompt: string,
    model: string,
    options?: Instance<typeof GenerationParams>,
    signal?: AbortSignal,
  ) {
    const response = await this.completionRequest(
      prompt,
      model,
      options,
      signal,
    )

    if (!response.ok || !response.body) {
      throw new Error(
        `Failed to generate: ${response.status} ${await response.text()}`,
      )
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    let remainder = ""
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }
      const chunks = (remainder + decoder.decode(value)).split("\n")
      for (const chunk of chunks) {
        if (!chunk) {
          continue
        }
        try {
          const json = JSON.parse(chunk)
          if (json.done) {
            break
          }
          yield json.response
        } catch (e) {
          if (e instanceof SyntaxError) {
            remainder += chunk
            continue
          }
          console.error(chunk)
          throw e
        }
      }
    }
  }
}
