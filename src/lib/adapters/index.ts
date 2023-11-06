import { OllamaAdapter } from "."
import { HuggingFaceAdapter } from "."

export { HuggingFaceAdapter } from "./HuggingFace"
export { OllamaAdapter } from "./Ollama"

export const AdapterMap = {
  HuggingFace: HuggingFaceAdapter,
  Ollama: OllamaAdapter,
}

export const AdapterList = Object.keys(AdapterMap)
