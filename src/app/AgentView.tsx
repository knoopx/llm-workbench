import { observer } from "mobx-react"
import { ModelPicker } from "../components/ModelPicker"
import { useStore } from "@/store"
import { Input } from "@/components/ui/input"
import { AgentGenerationParams } from "../components/AgentGenerationParams"
import { AgentHistory } from "../components/AgentConversation"
import { AgentPromptTemplate } from "./AgentPromptTemplate"
import { Button } from "@/components/ui/button"
import { IoMdAdd, IoMdCopy, IoMdTrash } from "react-icons/io"
import { AutoTextarea } from "@/components/AutoTextarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Picker } from "@/components/Picker"
import { Instance, getSnapshot } from "mobx-state-tree"
import { Agent } from "@/store/Agent"
import { AdapterList } from "@/lib/adapters"
import { cn } from "@/lib/utils"

const AgentConversation = observer(({ agent }) => (
  <div className="space-y-8">
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="font-medium">Conversation History</span>
        <Button size="icon" variant="ghost" onClick={() => agent.addMessage()}>
          <IoMdAdd />
        </Button>
      </div>

      <AgentHistory agent={agent} />
    </div>

    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="font-medium">Templates</span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <IoMdAdd />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="end"
            className="w-80 space-y-1"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault()
                document.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "Escape" }),
                )
                agent.addTemplate({ id: e.target.elements.id.value })
              }}
            >
              <Input name="id" autoFocus />
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2 bg-muted rounded p-2">
        <div className="flex flex-col space-y-4">
          {agent.templates.map((template) => (
            <div key={template.id} className="flex-auto space-y-1">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{template.id}</div>
                <button
                  onClick={() => {
                    agent.remove(template)
                  }}
                >
                  <IoMdTrash />
                </button>
              </div>

              <AutoTextarea
                value={template.content}
                onChange={(content) => {
                  template.update({ content })
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>

    <div className="space-y-2">
      <span className="font-medium">Prompt Template</span>
      <AgentPromptTemplate agent={agent} />
      <span className="flex flex-col space-y-2">
        <span className="font-medium">Preview</span>
        <div className="w-95 text-xs font-mono whitespace-pre overflow-auto bg-muted p-4 rounded-md">
          {agent.promptPreview}
        </div>
      </span>
    </div>
  </div>
))

const AdapterPicker: React.FC<{
  agent: Instance<typeof Agent>
}> = observer(({ agent }) => {
  const options = AdapterList.map((adapter) => ({
    key: adapter,
    value: adapter,
  }))

  return (
    <div className="space-y-2">
      <span className="font-medium">Adapter</span>
      <Picker
        value={agent.adapter.type}
        options={options}
        onChange={(type) => {
          agent.adapter.update({ type })
          if (agent.adapter.baseUrl == "") {
            if (agent.adapter.type == "Ollama") {
              agent.adapter.update({ baseUrl: "http://localhost:11434" })
            } else if (agent.adapter.type == "HuggingFace") {
              agent.adapter.update({ baseUrl: "http://localhost:8080" })
            }
          }
        }}
      />
    </div>
  )
})

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
