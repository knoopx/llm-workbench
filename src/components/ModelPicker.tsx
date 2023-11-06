import { observer } from "mobx-react"
import { IoMdRefresh } from "react-icons/io"
import { Button } from "@/components/ui/button"
import { ModelSelect } from "./ModelSelect"
import { Instance } from "mobx-state-tree"
import { Agent } from "@/store/Agent"
import { Input } from "./ui/input"

export const ModelPicker = observer(
  ({ agent }: { agent: Instance<typeof Agent> }) => {
    return (
      <div className="flex space-x-2">
        {agent.adapter.isMultiModal ? (
          <>
            <ModelSelect agent={agent} />
            <Button onClick={agent.adapter.refreshModels}>
              <IoMdRefresh size="1.25em" />
            </Button>
          </>
        ) : (
          <Input
            value={agent.adapter.model}
            onChange={agent.adapter.setModel}
          />
        )}
      </div>
    )
  },
)
