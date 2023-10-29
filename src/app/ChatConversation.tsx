import { Input } from "@/components/ui/input"
import { observer } from "mobx-react"
import { Button } from "../components/ui/button"
import { IoMdTrash, IoMdRefresh } from "react-icons/io"
import { ScrollArea } from "../components/ui/scroll-area"
import { Message } from "./ChatConversationMessage"
import { ToggleDarkButton } from "./ToggleDarkButton"
import { useStore } from "@/store"
import { ImMagicWand } from "react-icons/im"
import { VscDebugContinueSmall } from "react-icons/vsc"
import { BiArrowToTop } from "react-icons/bi"

export const ChatConversation = observer(() => {
  const { activeChat: chat } = useStore()
  const messages = [
    // {
    //   role: "system",
    //   content: chat.systemMessage,
    // },
    // {
    //   role: "user",
    //   content: chat.user_message,
    // },
    ...chat.messages,
  ]
  return (
    <div className="flex flex-col">
      <ScrollArea className="flex-auto ">
        <div className="mx-auto w-3/5">
          {messages.map((message, i) => (
            <Message key={i} {...message} />
          ))}
        </div>
      </ScrollArea>
      <div className="flex-none flex items-center space-x-4 p-8 min-h-0 mx-auto w-3/5">
        <ToggleDarkButton />
        <form className="flex-auto flex" onSubmit={chat.onSubmit}>
          <Input autoFocus placeholder="Enter text..." />
        </form>

        <div className="space-x-1">
          <Button onClick={chat.regenerate}>
            <IoMdRefresh size="1.5em" />
          </Button>
          <Button onClick={chat.respond}>
            <VscDebugContinueSmall size="1.5em" />
          </Button>
          <Button onClick={chat.pop}>
            <BiArrowToTop size="1.5em" />
          </Button>
          <Button onClick={chat.onClearConversation}>
            <IoMdTrash size="1.5em" />
          </Button>
        </div>
      </div>
    </div>
  )
})
