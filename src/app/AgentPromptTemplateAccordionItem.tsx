import { observer } from "mobx-react";
import { useStore } from "@/store";
import { TbPrompt } from "react-icons/tb";
import { AppAccordionItem } from "./AppAccordionItem";
import { AgentPromptTemplate } from "./AgentPromptTemplate";

const AgentPromptTemplateAccordionItem = observer(() => {
  const store = useStore();
  const {
    state: { resource: agent },
  } = store;

  return (
    <AppAccordionItem
      id="prompt-template"
      icon={TbPrompt}
      title="Prompt Template"
    >
      <AgentPromptTemplate agent={agent} />
    </AppAccordionItem>
  );
});
