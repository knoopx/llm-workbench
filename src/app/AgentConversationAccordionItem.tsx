import { observer } from "mobx-react";
import { useStore } from "@/store";
import { MdOutlineHistory } from "react-icons/md";
import { AgentHistory } from "../components/AgentConversation";
import { AppAccordionItem } from "./AppAccordionItem";

export const AgentConversationAccordionItem = observer(() => {
  const store = useStore();
  const {
    state: { resource: agent },
  } = store;

  return (
    <AppAccordionItem
      id="agent-history"
      icon={MdOutlineHistory}
      title="Conversation History"
    >
      <AgentHistory agent={agent} />
    </AppAccordionItem>
  );
});
