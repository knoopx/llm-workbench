import { SliderCheckbox } from "./SliderCheckbox"
import { Instance } from "mobx-state-tree"
import { Agent } from "@/store/Agent"
import { observer } from "mobx-react"
import { cn } from "@/lib/utils"

const GENERATION_PARAMS = [
  {
    id: "temperature",
    label: "Temperature",
    max: 1,
    step: 0.1,
  },
  {
    id: "top_k",
    label: "Top K",
    max: 1,
    step: 0.1,
  },
  {
    id: "top_p",
    label: "Top P",
    max: 1,
    step: 0.1,
  },
  {
    id: "repeat_last_n",
    label: "Repeat Window",
    max: 1024 * 8,
    step: 64,
  },
  {
    id: "repeat_penalty",
    label: "Reptition Penalty",
    max: 2,
    step: 0.1,
  },
  {
    id: "num_predict",
    label: "Max. Tokens",
    max: 1024 * 8,
    step: 64,
  },
  {
    id: "num_ctx",
    label: "Context Window",
    max: 1024 * 8,
    step: 64,
  },
]
export const AgentGenerationParams: React.FC<{
  agent: Instance<typeof Agent>
}> = observer(({ className, agent }) => {
  const changeProps = (key: string) => ({
    value: agent.parameters[key],
    onChange: (value: string) => {
      agent.update({ parameters: { ...agent.parameters, [key]: value } })
    },
    checked: agent.checkedOptions.includes(key),
    onCheckedChange: (value: boolean) => {
      if (value) {
        agent.update({
          checkedOptions: Array.from(new Set([...agent.checkedOptions, key])),
        })
      } else {
        agent.update({
          checkedOptions: agent.checkedOptions.filter((x) => x !== key),
        })
      }
    },
  })

  const params = GENERATION_PARAMS.filter((param) =>
    agent.adapter.parameters.includes(param.id),
  )

  return (
    <div className={cn("space-y-4", className)}>
      {params.map((param) => (
        <SliderCheckbox key={param.id} {...param} {...changeProps(param.id)} />
      ))}
    </div>
  )
})
