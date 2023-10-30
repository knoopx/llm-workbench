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

export class OllamaClient {
  endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  async models() {
    const models = await fetch(`${this.endpoint}/api/tags`)
    const result = await models.json()
    return result.models
  }

  async info(modelName: string) {
    const options = await fetch(`${this.endpoint}/api/show`, {
      method: "POST",
      body: JSON.stringify({
        name: modelName,
      }),
    })
    return await options.json()
  }
  _completion(prompt: string, model: string, options?: GenerateOptions) {
    return fetch(`${this.endpoint}/api/generate`, {
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

  async *completion(prompt: string, model: string, options?: GenerateOptions) {
    const response = await this._completion(prompt, model, options)

    if (!response.ok || !response.body) {
      throw new Error(
        `Failed to generate: ${response.status} ${await response.text()}`,
      )
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }
      const chunks = decoder.decode(value).split("\n")
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
          console.error(chunk)
          throw e
        }
      }
    }
  }
}
