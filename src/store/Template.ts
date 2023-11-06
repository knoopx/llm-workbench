import { types as t } from "mobx-state-tree";
import { Instance } from "mobx-state-tree";

export const Template = t
  .model("Template", {
    id: t.identifier,
    content: t.optional(t.string, ""),
  })
  .actions((self) => ({
    update(props: Partial<Instance<typeof self>>) {
      Object.assign(self, props);
    },
  }));
