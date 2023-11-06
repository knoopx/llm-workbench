import { Agent } from "@/store/Agent"
import { Instance } from "mobx-state-tree"
import { observer } from "mobx-react"
import { AutoTextarea } from "@/components/AutoTextarea"

export const AgentPromptTemplate: React.FC<{
  agent: Instance<typeof Agent>
}> = observer(({ agent }) => {
  return (
    <AutoTextarea
      className="flex-auto font-mono text-xs whitespace-pre"
      value={agent.promptTemplate}
      onChange={(prompt_template) =>
        agent.update({ promptTemplate: prompt_template })
      }
    />
  )
})
