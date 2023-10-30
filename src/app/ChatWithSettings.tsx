import { observer } from "mobx-react"
import { ChatSettings } from "./ChatSettings"
import { ChatConversation } from "./ChatConversation"

export const ChatWithSettings = observer(() => {
  return (
    <div className="grid grid-cols-[auto,24em] auto-rows-fr divide-x-1">
      <ChatConversation />
      <ChatSettings />
    </div>
  )
})
