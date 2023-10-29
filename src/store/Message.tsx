import { types as t } from "mobx-state-tree";


export const Message = t
  .model("Message", {
    role: t.optional(t.string, "user"),
    content: t.string,
    date: t.optional(t.Date, () => new Date()),
  })
  .actions((self) => ({
    update(content: string) {
      self.content = content;
    },
  }));
