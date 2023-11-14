import { observer } from "mobx-react"
import { useStore } from "@/store"
import { Input } from "@/components/ui/input"
import { AgentGenerationParams } from "../components/AgentGenerationParams"
import { Button } from "@/components/ui/button"
import { IoMdCopy } from "react-icons/io"
import { Instance, getSnapshot } from "mobx-state-tree"
import { Agent } from "@/store/Agent"
import { AgentConversation } from "../components/AgentConversation"
import { AgentAdapterPicker } from "../components/AgentAdapterPicker"

export const AgentView = observer(() => {
  const {
    addAgent,
    state: { resource: agent },
  } = useStore()

  return (
    <div className="px-16 py-8 space-y-4">
      <div className="grid grid-cols-2 gap-16">
        <div className="space-y-2 mb-4">
          <span className="font-medium">Agent Name</span>
          <div className="flex items-center space-x-2">
            <Input
              autoFocus
              className="w-full text-xl"
              value={agent.name}
              onChange={(e) => agent.update({ name: e.target.value })}
            />
            <Button
              onClick={() => {
                const { id, name, ...props } = getSnapshot(agent) as Instance<
                  typeof Agent
                >
                addAgent({ name: `Copy of ${name}`, ...props })
              }}
            >
              <IoMdCopy size="1.2em" />
            </Button>
          </div>
        </div>
        <AgentAdapterPicker
          className="grid grid-cols-[15ch,auto,auto] auto-rows-auto gap-4"
          agent={agent}
        />
      </div>

      <div className="grid grid-cols-2 gap-16">
        <AgentConversation agent={agent} />
        <div>
          <div className="font-medium mb-4">Default Parameters</div>
          <AgentGenerationParams agent={agent} />
        </div>
      </div>
    </div>
  )
})
