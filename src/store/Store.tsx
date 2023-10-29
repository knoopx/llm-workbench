import { types as t, Instance, destroy } from "mobx-state-tree"
import { Chat } from "./Chat"
import { OllamaClient } from "@/lib/OllamaClient"
import { reaction } from "mobx"
import { Model } from "./Model"
import { Presets } from "./Presets"

export const Store = t
  .model("Store", {
    endpoint: t.optional(t.string, "http://localhost:11434"),
    connected: t.optional(t.boolean, false),
    activeChat: t.maybeNull(t.reference(Chat)),
    chats: t.array(Chat),
    models: t.array(Model),
    presets: t.optional(Presets, {}),
  })
  .views((self) => ({
    get client() {
      return new OllamaClient(self.endpoint)
    },
  }))

  .actions((self) => ({
    setEndpoint(endpoint: string) {
      self.endpoint = endpoint
    },
    setConnected(connected: boolean) {
      self.connected = connected
    },
    addChat(chat: Instance<typeof Chat>) {
      self.chats.push(chat)
      self.activeChat = self.chats[self.chats.length - 1]
    },
    newChat() {
      if (self.models.length === 0) return
      this.addChat({
        model: self.models[0].name,
      })
    },
    afterCreate() {
      reaction(() => self.endpoint, this.refreshModels)
      this.refreshModels()
    },
    refreshModels() {
      self.client
        .models()
        .catch((err) => {
          console.error(err)
          this.setConnected(false)
        })
        .then((models) => {
          this.setModels(models)
          if (self.chats.length === 0) {
            this.newChat()
          }
          this.setConnected(true)
        })
    },
    setModels(values: typeof self.models) {
      self.models = values
    },
    removeChat(chat: Instance<typeof Chat>) {
      if (self.activeChat == chat) {
        self.activeChat = null
      }
      destroy(chat)
    },
    setActiveChat(chat: Instance<typeof Chat>) {
      self.activeChat = chat
    },
  }))
