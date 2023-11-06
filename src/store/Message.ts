import { getParent, getParentOfType, types as t } from "mobx-state-tree"
import { Chat } from "./Chat"

export const Message = t
  .model("Message", {
    role: t.optional(t.string, "user"),
    content: t.optional(t.string, ""),
    date: t.optional(t.Date, () => new Date()),
    open: t.optional(t.boolean, false),
  })
  .views((self) => ({
    get isEmpty() {
      return !self.content
    },
    get chat() {
      return getParentOfType(self, Chat)
    },
    get agent() {
      return getParent(self, 2)
    },
  }))
  .actions((self) => ({
    update(props: Partial<typeof self>) {
      Object.assign(self, props)
    },
    remove() {
      self.agent.remove(self)
    },
  }))
