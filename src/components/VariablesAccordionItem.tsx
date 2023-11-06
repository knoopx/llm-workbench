import { observer } from "mobx-react"
import { useStore } from "@/store"
import { Input } from "@/components/ui/input"
import { IoMdAdd, IoMdTrash } from "react-icons/io"
import { Button } from "@/components/ui/button"
import { HiMiniVariable } from "react-icons/hi2"
import { AppAccordionItem } from "../app/AppAccordionItem"

export const VariablesAccordionItem = observer(() => {
  const store = useStore()
  const {
    state: { resource: agent },
  } = store

  return (
    <AppAccordionItem id="variables" icon={HiMiniVariable} title="Variables">
      <Button onClick={() => agent.addVariable({ key: "", value: "" })}>
        <IoMdAdd />
      </Button>

      <div className="flex flex-col space-y-2">
        {agent.variables.map((variable, i) => (
          <div key={i} className="flex space-x-2">
            <Input
              placeholder="name"
              value={variable.key}
              onChange={(e) => variable.update({ key: e.target.value })}
            />
            <Input
              placeholder="value"
              value={variable.value}
              onChange={(e) => variable.update({ value: e.target.value })}
            />
            <Button onClick={variable.remove}>
              <IoMdTrash />
            </Button>
          </div>
        ))}
      </div>
    </AppAccordionItem>
  )
})
