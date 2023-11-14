import { types as t, Instance, destroy } from "mobx-state-tree"
import { Chat } from "./Chat"
import { Model } from "./Model"
import { Agent } from "./Agent"
import { State } from "./State"
import { Playground } from "./Playground"
import { DEFAULT_AGENTS } from "./defaults"

export const Store = t
  .model("Store", {
    chats: t.array(Chat),
    agents: t.optional(t.array(Agent), DEFAULT_AGENTS),
    models: t.array(Model),
    state: t.optional(State, {}),
    playground: t.optional(Playground, {}),
  })
  .views((self) => ({
    get lastChat() {
      return self.chats[self.chats.length - 1]
    },
    get lastUsedAgent() {
      return this.lastChat?.agent
    },
  }))
  .actions((self) => ({
    addChat(chat: Instance<typeof Chat> = {} as Instance<typeof Chat>) {
      self.chats.push(chat)
      self.state.navigate(self.chats[self.chats.length - 1])
    },
    addAgent(agent: Instance<typeof Agent> = {} as Instance<typeof Agent>) {
      self.agents.push(agent)
      self.state.navigate(self.agents[self.agents.length - 1])
    },
    newChat() {
      this.addChat({ agent: self.lastUsedAgent })
    },
    newAgent() {
      this.addAgent()
    },
    removeChat(chat: Instance<typeof Chat>) {
      if (self.state.resource == chat) {
        self.state.resource = null
      }
      destroy(chat)
    },
    removeAgent(agent: Instance<typeof Agent>) {
      if (self.state.resource == agent) {
        self.state.resource = null
      }
      destroy(agent)
    },
  }))
