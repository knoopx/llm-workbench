import { getParent, types as t } from "mobx-state-tree"

export const Message = t
  .model("Message", {
    role: t.optional(t.string, "user"),
    content: t.string,
    date: t.optional(t.Date, () => new Date()),
    open: t.optional(t.boolean, false),
  })
  .views((self) => ({
    get isEmpty() {
      return !self.content
    },
  }))
  .actions((self) => ({
    update(props: Partial<typeof self>) {
      Object.assign(self, props)
    },
    remove() {
      getParent(self, 2).remove(self)
    },
  }))
