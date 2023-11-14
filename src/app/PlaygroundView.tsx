import { AgentGenerationParams } from "@/components/AgentGenerationParams"
import { useStore } from "@/store"
import { observer } from "mobx-react"
import { AgentAdapterPicker } from "../components/AgentAdapterPicker"
import { useDebouncedCallback } from "use-debounce"
export const PlaygroundView = observer(() => {
  const {
    playground: { agent, generate, abortController, output, update },
  } = useStore()

  const debounced = useDebouncedCallback(() => {
    generate()
  }, 200)

  return (
    <div className="flex-auto grid grid-cols-[auto,50ch] divide-x-1">
      <div className="flex flex-col p-8">
        <div className="flex-auto relative font-mono">
          <textarea
            key="prompt"
            className="w-full h-full resize-none outline-none bg-transparent"
            value={agent.promptTemplate}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                abortController?.abort()
                update({ output: "" })
              } else if (e.key === "Tab") {
                e.preventDefault()
                agent.update({ promptTemplate: agent.promptTemplate + output })
                update({ output: "" })
              } else if (e.key === "Enter" && e.ctrlKey) {
                e.preventDefault()
                generate()
              }
            }}
            onChange={(e) => {
              agent.update({ promptTemplate: e.target.value })
              debounced()
            }}
          />
          <div
            className="absolute inset-0 text-muted-foreground pointer-events-none"
            style={{
              whiteSpaceCollapse: "preserve",
            }}
          >
            <span className="invisible">{agent.promptTemplate}</span>
            {output}
          </div>
        </div>
      </div>
      <div className="px-8 py-4 space-y-4">
        <AgentAdapterPicker agent={agent} />
        <AgentGenerationParams agent={agent} />
      </div>
    </div>
  )
})
