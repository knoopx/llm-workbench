import { observer } from "mobx-react"
import { Agent } from "@/store/Agent"
import { Instance } from "mobx-state-tree"
import { AgentMessage } from "./AgentMessage"
import { Message } from "@/store/Message"

export const AgentHistory: React.FC<{
  agent: Instance<typeof Agent>
}> = observer(({ agent }) => (
  <div className="space-y-2">
    <div className="flex flex-col space-y-1">
      {agent.messages.map((message: Instance<typeof Message>, i: number) => (
        <AgentMessage key={i} message={message} />
      ))}
    </div>
  </div>
))
