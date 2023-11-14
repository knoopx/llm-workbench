import { observer } from "mobx-react"
import { Button } from "./ui/button"
import { IoMdTrash, IoMdRefresh } from "react-icons/io"
import { ScrollArea } from "./ui/scroll-area"
import { ChatConversationMessage } from "./ChatConversationMessage"
import { VscDebugContinue, VscDebugStart, VscDebugStop } from "react-icons/vsc"
import { BiArrowToTop } from "react-icons/bi"
import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"
import { Instance } from "mobx-state-tree"
import { Chat } from "@/store/Chat"
import { reaction, toJS } from "mobx"
import { ChatUserInput } from "./PromptInput"
import { animate } from "@/lib/animation"

const useReaction = (observe: () => any, fn: () => void, deps: any[] = []) => {
  useEffect(() => {
    return reaction(observe, fn)
  }, deps)
}

export const ChatConversation = observer(
  ({ chat }: { chat: Instance<typeof Chat> }) => {
    const ref = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
      const scrollContainer = ref.current?.querySelector(
        "[data-radix-scroll-area-viewport]",
      )
      if (!scrollContainer) return

      if (scrollContainer.scrollHeight > scrollContainer.scrollTop) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }

    useEffect(() => scrollToBottom(), [])
    useReaction(() => chat.lastAssistantMessage?.content, scrollToBottom)

    return (
      <div className="flex flex-col">
        <ScrollArea ref={ref} className="flex-auto">
          <div className="flex flex-auto flex-col items-center">
            {chat.messages.map((message, i) => (
              <ChatConversationMessage key={i} message={message} />
            ))}
          </div>
        </ScrollArea>
        <div
          className={cn(
            "flex-none flex-col flex items-center space-x-4 space-y-2 p-8 min-h-0 mx-auto min-w-[65ch]",
            {
              hidden: !chat.agent,
            },
          )}
        >
          <div className="space-x-1">
            {chat.isRunning ? (
              <Button
                onClick={() => {
                  chat.abort()
                }}
              >
                <VscDebugStop size="1.5em" />
              </Button>
            ) : (
              <>
                <Button onClick={chat.regenerate}>
                  <IoMdRefresh size="1.5em" />
                </Button>
                <Button onClick={() => chat.reply(false)}>
                  <VscDebugStart size="1.5em" />
                </Button>
                <Button onClick={chat.reply}>
                  <VscDebugContinue size="1.5em" />
                </Button>
                <Button onClick={chat.pop}>
                  <BiArrowToTop size="1.5em" />
                </Button>
                <Button onClick={chat.clear}>
                  <IoMdTrash size="1.5em" />
                </Button>
              </>
            )}
          </div>
          <ChatUserInput chat={chat} />
        </div>
      </div>
    )
  },
)
