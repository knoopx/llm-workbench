import { useStore } from "@/store"
import { observer } from "mobx-react"
import { ChatList } from "./SidebarChatList"
import { AgentList } from "./SidebarAgentList"
import { SidebarItem } from "../components/SidebarItem"
import { SidebarSection } from "../components/SidebarSection"
import { ToggleDarkButton } from "@/components/ToggleDarkButton"
import { VscTools } from "react-icons/vsc"
export const Sidebar = observer(() => {
  const { agents, chats } = useStore()

  return (
    <div className={"flex flex-col divide-y-1 border-r-1 overflow-auto"}>
      <ChatList chats={chats} />

      <SidebarSection title="Tools" actions={<ToggleDarkButton />}>
        <SidebarItem route="playground" icon={VscTools}>
          Playground
        </SidebarItem>
      </SidebarSection>
      <AgentList agents={agents} />
    </div>
  )
})
