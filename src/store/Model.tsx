import { types as t } from "mobx-state-tree"
export const Model = t.model("Model", {
  name: t.string,
  digest: t.string,
  size: t.number,
  modified_at: t.string,
})
