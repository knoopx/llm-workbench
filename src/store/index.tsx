import { types as t, Instance } from "mobx-state-tree"
import { Chat } from "./chat"
import { createContext, useContext } from "react"

export default t
  .model("RootStore", {
    activeChat: t.maybeNull(t.reference(Chat)),
    chats: t.array(Chat),
    models: t.array(
      t.model("Model", {
        digest: t.string,
        name: t.string,
      }),
    ),
  })
  .actions((self) => ({
    addChat(chat: Instance<typeof Chat>) {
      self.chats.push(chat)
      self.activeChat = self.chats[0]
    },
    afterCreate() {
      const fetchModels = async () => {
        const models = await fetch("http://127.0.0.1:11434/api/tags")
        const result = await models.json()
        this.setModels(result.models)
        if (self.chats.length === 0) {
          this.addChat({
            model: self.models[0].name,
          })
        }
      }
      fetchModels()
    },
    setModels(values: typeof self.models) {
      self.models.replace(values)
    },
  }))

export const StoreContext = createContext<Instance<typeof Store> | null>(null)

export const useStore = () => {
  return useContext(StoreContext)
}
