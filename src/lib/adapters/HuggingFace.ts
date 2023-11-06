// https://github.com/huggingface/text-generation-inference/blob/main/docs/openapi.json

import { HfInferenceEndpoint, TextGenerationArgs } from "@huggingface/inference"
import { listModels } from "@huggingface/hub"
import { GenerationParams } from "@/store/Agent"
import { Instance } from "mobx-state-tree"

function transformParams(
  params: Instance<typeof GenerationParams>,
): TextGenerationArgs["parameters"] {
  return {
    max_new_tokens: params.num_predict,
    repetition_penalty: params.repeat_penalty,
    return_full_text: true,
    temperature: params.temperature,
    top_k: params.top_k,
    top_p: params.top_p,
    stop_sequences: params.stop,
    do_sample: true,
    // TODO: add support for these params
    // max_time
    // num_return_sequences
    // truncate
  }
}
export class HuggingFaceAdapter {
  endpoint: HfInferenceEndpoint
  parameters = [
    "num_predict",
    "repeat_last_n",
    "repeat_penalty",
    "stop",
    "temperature",
    "top_p",
    "top_k",
  ] as (keyof Instance<typeof GenerationParams>)[]

  constructor(public baseUrl: string) {
    this.endpoint = new HfInferenceEndpoint(baseUrl)
  }

  async *completion(
    prompt: string,
    model: string, // hf endpoints are not multi-model
    options?: Instance<typeof GenerationParams>,
    signal?: AbortSignal,
  ) {
    for await (const output of this.endpoint.textGenerationStream({
      inputs: prompt,
      parameters: transformParams(options ?? {}),
    })) {
      if (signal?.aborted) break
      yield output.token.text
    }
  }
}
