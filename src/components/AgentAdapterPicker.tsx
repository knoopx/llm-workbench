import { observer } from "mobx-react"
import { ModelPicker } from "./ModelPicker"
import { Input } from "@/components/ui/input"
import { Instance } from "mobx-state-tree"
import { Agent } from "@/store/Agent"
import { cn } from "@/lib/utils"
import { AdapterPicker } from "./AdapterPicker"

export const AgentAdapterPicker: React.FC<{
  className?: string
  agent: Instance<typeof Agent>
}> = observer(({ className, agent }) => (
  <div className={cn("grid gap-2", className)}>
    <AdapterPicker agent={agent} />

    <div className="space-y-2">
      <span className="font-medium">Endpoint</span>
      <Input
        className="w-full"
        value={agent.adapter.baseUrl}
        onChange={(e) => agent.adapter.update({ baseUrl: e.target.value })}
      />
    </div>
    {agent.adapter.isMultiModal && (
      <div className="space-y-2">
        <span className="font-medium">Model</span>
        <ModelPicker agent={agent} />
      </div>
    )}
  </div>
))
