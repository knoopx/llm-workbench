import { observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import { useStore } from "@/store"
import { Chat } from "@/store/Chat"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

export const AgentPicker = observer(
  ({ chat, ...props }: { chat: Instance<typeof Chat> }) => {
    const { agents } = useStore()

    return (
      <div className="flex space-x-2">
        <Select
          {...props}
          value={chat.agent}
          onValueChange={(agent) => {
            chat.update({ agent })
          }}
        >
          <SelectTrigger className="font-medium italic">
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            {agents.map((agent) => (
              <SelectItem key={agent.id} value={agent}>
                {agent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  },
)
