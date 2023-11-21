import { observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import { useStore } from "@/store"
import { Chat } from "@/store/Chat"

import { Picker } from "./Picker"

export const AgentPicker = observer(
  ({ chat, ...props }: { chat: Instance<typeof Chat> }) => {
    const { agents } = useStore()

    const options = agents.map((agent) => ({
      key: agent.name,
      value: agent.name,
    }))

    return (
      <Picker
        {...props}
        value={chat.agent?.name}
        options={options}
        onChange={(agent) => {
          chat.update({ agent: agents.find((a) => a.name === agent) })
        }}
      />
    )
  },
)
