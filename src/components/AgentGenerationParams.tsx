import { SliderCheckbox } from "./SliderCheckbox"
import { Instance } from "mobx-state-tree"
import { Agent } from "@/store/Agent"
import { observer, useLocalStore } from "mobx-react"
import { cn } from "@/lib/utils"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Checkbox } from "./ui/checkbox"
import { IoMdTrash } from "react-icons/io"
import { Button } from "./ui/button"

const GENERATION_PARAMS = [
  {
    id: "num_predict",
    label: "Max. Tokens",
    max: 1024 * 8,
    step: 64,
  },
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
    id: "num_ctx",
    label: "Context Window",
    max: 1024 * 8,
    step: 64,
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
]

const AgentStopPatternEditor: React.FC<{
  agent: Instance<typeof Agent>
}> = observer(({ agent }) => {
  const state = useLocalStore(() => ({
    draft: "",
    update(value: string) {
      this.draft = value
    },
  }))

  return (
    <div className="space-y-2">
      <Label className="flex items-center space-x-2">
        <Checkbox
          checked={agent.checkedOptions.includes("stop")}
          onCheckedChange={(value: boolean) => {
            if (value) {
              agent.update({
                checkedOptions: Array.from(
                  new Set([...agent.checkedOptions, "stop"]),
                ),
              })
            } else {
              agent.update({
                checkedOptions: agent.checkedOptions.filter(
                  (x) => x !== "stop",
                ),
              })
            }
          }}
        />
        <span>Stop Patterns</span>
      </Label>
      <div className="ml-6 space-y-1">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            agent.update({
              parameters: {
                ...agent.parameters,
                stop: Array.from(
                  new Set([...(agent.parameters?.stop ?? []), state.draft]),
                ),
              },
            })
            state.update("")
          }}
        >
          <Input
            placeholder="Add new..."
            value={state.draft}
            onChange={(e) => state.update(e.target.value)}
          />
        </form>
        {agent.parameters?.stop.map((pattern) => (
          <div className="flex items-center space-x-2">
            <Input className="text-xs font-mono" value={pattern} />
            <Button
              onClick={(e) => {
                e.preventDefault()
                agent.update({
                  parameters: {
                    ...agent.parameters,
                    stop: agent.parameters?.stop.filter((x) => x !== pattern),
                  },
                })
              }}
            >
              <IoMdTrash />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
})

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

  const parameters = GENERATION_PARAMS.filter((param) =>
    agent.adapter.parameters.includes(param.id),
  )

  return (
    <div className={cn("space-y-4", className)}>
      {parameters.map((param) => (
        <SliderCheckbox key={param.id} {...param} {...changeProps(param.id)} />
      ))}

      <AgentStopPatternEditor agent={agent} />
    </div>
  )
})
