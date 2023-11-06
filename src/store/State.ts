import { types as t, Instance, getType } from "mobx-state-tree"
import { Chat } from "./Chat"
import { Agent } from "./Agent"

export const State = t
  .model("State", {
    route: t.maybeNull(t.string),
    resource: t.maybeNull(t.reference(t.union(Chat, Agent))),
  })
  .actions((self) => ({
    update(state: Partial<Instance<typeof State>>) {
      Object.assign(self, state)
    },
    navigate(target: any) {
      if (typeof target === "string") {
        return this.update({ route: target, resource: null })
      }

      switch (getType(target)) {
        case Chat:
          return this.update({ route: "chat", resource: target })
        case Agent:
          return this.update({ route: "agent", resource: target })
      }
    },
  }))
