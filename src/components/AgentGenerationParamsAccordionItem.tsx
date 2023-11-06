import { observer } from "mobx-react"
import { MdTune } from "react-icons/md"
import { Instance } from "mobx-state-tree"
import { AgentGenerationParams } from "./AgentGenerationParams"
import { AppAccordionItem } from "../app/AppAccordionItem"
import { Agent } from "@/store/Agent"

export const AgentInferenceParamsAccordionItem = observer(
  ({ agent }: { agent: Instance<typeof Agent> }) => {
    return (
      <AppAccordionItem id="inference" icon={MdTune} title="Parameters">
        <AgentGenerationParams agent={agent} />
      </AppAccordionItem>
    )
  },
)
