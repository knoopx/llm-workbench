import { Instance, getParent, types as t } from "mobx-state-tree"
import { Chat } from "./Chat"

export const Attachment = t
  .model("Attachment", {
    name: t.string,
    content: t.string,
    path: t.string,
    size: t.number,
    type: t.string,
    embedding: t.maybeNull(t.array(t.number)),
  })
  .views((self) => ({
    get chat() {
      return getParent<Instance<typeof Chat>>(self, 2)
    },
    get lines() {
      // return self.content.split(/[\r\n\.\:]/g).filter(Boolean)
      return self.content.split(/[\r\n]/g).filter(Boolean)
    },
    get chunks() {
      const chunks = []
      for (let i = 0; i < this.lines.length; i++) {
        chunks.push(
          [this.lines[i - 1], this.lines[i], this.lines[i + 1]]
            .filter(Boolean)
            .join("\n"),
        )
      }
      return [...new Set(chunks)]
    },
  }))
  .actions((self) => ({
    update(props: Partial<typeof self>) {
      Object.assign(self, props)
    },
  }))
