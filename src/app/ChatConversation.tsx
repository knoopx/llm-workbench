import { observer } from "mobx-react"
import { Button } from "../components/ui/button"
import { IoMdTrash, IoMdRefresh } from "react-icons/io"
import { ScrollArea } from "../components/ui/scroll-area"
import { Message } from "./ChatConversationMessage"
import { ToggleDarkButton } from "./ToggleDarkButton"
import { useStore } from "@/store"
import { VscDebugContinue, VscDebugStart } from "react-icons/vsc"
import { BiArrowToTop } from "react-icons/bi"
import { cn } from "@/lib/utils"
import { AutoTextarea } from "./AutoTextarea"

const PromptInput = observer(() => {
  const { activeChat: chat } = useStore()
  return (
    <AutoTextarea
      className="w-full"
      value={chat.prompt}
      onChange={(e) => chat.setPrompt(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault()
          chat.userMessage(e.target.value)
          chat.setPrompt("")
        }
      }}
      autoFocus
      placeholder="Enter text..."
    />
  )
})

export const ChatConversation = observer(() => {
  const { activeChat: chat } = useStore()
  return (
    <div className="flex flex-col">
      <ScrollArea className="flex-auto">
        <div className="flex flex-auto flex-col items-center">
          {chat.messages.map((message, i) => (
            <Message key={i} {...message} />
          ))}
        </div>
      </ScrollArea>
      <div
        className={cn(
          "flex-none flex-col flex items-center space-x-4 space-y-2 p-8 min-h-0 mx-auto min-w-[65ch]",
          {
            hidden: !chat.model,
          },
        )}
      >
        <div className="space-x-1">
          <ToggleDarkButton />

          <Button onClick={chat.regenerate}>
            <IoMdRefresh size="1.5em" />
          </Button>
          <Button onClick={chat.respond}>
            <VscDebugStart size="1.5em" />
          </Button>
          <Button onClick={chat.respond}>
            <VscDebugContinue size="1.5em" />
          </Button>
          <Button onClick={chat.pop}>
            <BiArrowToTop size="1.5em" />
          </Button>
          <Button onClick={chat.onClearConversation}>
            <IoMdTrash size="1.5em" />
          </Button>
        </div>
        <PromptInput />
      </div>
    </div>
  )
})
