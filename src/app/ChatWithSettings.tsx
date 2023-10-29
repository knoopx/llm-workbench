import { observer } from "mobx-react"
import { Chat } from "@/store/chat"
import { Instance } from "mobx-state-tree"
import { ChatSettings } from "./ChatSettings"
import { ChatConversation } from "./ChatConversation"

export const ChatWithSettings = observer(
  ({ chat }: { chat: Instance<typeof Chat> }) => {
    return (
      <div className="grid grid-cols-[auto,24em] auto-rows-fr divide-x-1">
        <ChatConversation chat={chat} />
        <ChatSettings chat={chat} />
      </div>
    )
  },
)
