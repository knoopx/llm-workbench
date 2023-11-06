import { types as t } from "mobx-state-tree"
import { Agent } from "./Agent"

export const Playground = t
  .model("Playground", {
    output: t.optional(t.string, ""),
    agent: t.optional(Agent, {}),
  })
  .volatile((self) => ({
    abortController: null as AbortController | null,
  }))
  .actions((self) => ({
    update(props: Partial<typeof self>) {
      Object.assign(self, props)
    },
    abort() {
      self.abortController?.abort()
      self.update({ abortController: null })
    },
    async generate() {
      this.abort()

      this.update({ output: "", abortController: new AbortController() })

      console.log(`"${self.agent.promptTemplate}"`)
      try {
        if (!self.agent.promptTemplate) return
        const output = self.agent.adapter.instance.completion(
          self.agent.promptTemplate,
          self.agent.model,
          self.agent.overridedOptions,
          self.abortController!.signal,
        )
        for await (const chunk of output) {
          this.update({ output: self.output + chunk })
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.abort()
      }
    },
  }))
