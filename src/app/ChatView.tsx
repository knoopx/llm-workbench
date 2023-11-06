import { observer } from "mobx-react"
import { ChatSettings } from "../components/ChatSettings"
import { ChatConversation } from "./ChatConversation"
import { useStore } from "@/store"

export const ChatView = observer(() => {
  const {
    state: { resource: chat },
  } = useStore()

  return (
    <div className="grid grid-cols-[auto,24em] auto-rows-fr divide-x-1">
      <ChatConversation chat={chat} />
      <ChatSettings chat={chat} />
    </div>
  )
})
