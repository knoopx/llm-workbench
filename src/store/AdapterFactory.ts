import { types as t } from "mobx-state-tree"
import { Instance } from "mobx-state-tree"
import { AdapterList, AdapterMap } from "@/lib/adapters"
import { Model } from "./Model"
import { autorun } from "mobx"

export const AdapterFactory = t
  .model("AdapterFactory", {
    baseUrl: t.optional(t.string, ""),
    models: t.optional(t.array(Model), []),
    type: t.optional(t.enumeration(AdapterList), AdapterList[0]),
  })
  .views((self) => ({
    get isMultiModal() {
      // todo: make an abstract adapter class for multi-model endpoints
      return self.type === "Ollama"
    },
    get instance() {
      return new AdapterMap[self.type as keyof typeof AdapterMap](self.baseUrl)
    },

    get parameters() {
      return this.instance.parameters
    },
  }))
  .actions((self) => ({
    afterCreate() {
      this.refreshModels()
    },
    update(props: Partial<Instance<typeof self>>) {
      Object.assign(self, props)
    },
    async refreshModels() {
      if (self.isMultiModal) {
        try {
          const models = await self.instance.models()
          this.update({ models })
        } catch (e) {
          // console.error(e)
        }
      }
    },
  }))
