import { observer } from "mobx-react"
import { Button } from "../components/ui/button"
import { IoMdTrash, IoMdRefresh } from "react-icons/io"
import { ScrollArea } from "../components/ui/scroll-area"
import { ChatConversationMessage } from "./ChatConversationMessage"
import { useStore } from "@/store"
import { VscDebugContinue, VscDebugStart, VscDebugStop } from "react-icons/vsc"
import { BiArrowToTop } from "react-icons/bi"
import { cn } from "@/lib/utils"
import { AutoTextarea } from "../components/AutoTextarea"
import { html2md } from "@/lib/utils"
import { extractHTML } from "@/lib/utils"
import { useEffect, useRef } from "react"
import { Instance } from "mobx-state-tree"
import { Chat } from "@/store/Chat"
import { toJS } from "mobx"

const PromptInput = observer(() => {
  const {
    state: { resource: chat },
  } = useStore()

  const handleInput = async (input: string) => {
    if (input.startsWith("http")) {
      const body = await extractHTML(input)
      const md = html2md(body?.outerHTML)
      chat.addMessage({
        content: md,
        role: "user",
      })
    } else {
      chat.send(input)
    }
  }

  return (
    <AutoTextarea
      className="w-full"
      value={chat.prompt}
      onChange={(e) => chat.update({ prompt: e.target.value })}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault()
          chat.update({ prompt: "" })
          handleInput(e.target.value)
        }
      }}
      autoFocus
      placeholder="Enter text..."
    />
  )
})

export const ChatConversation = observer(
  ({ chat }: { chat: Instance<typeof Chat> }) => {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
      const scrollContainer = ref.current?.querySelector(
        "[data-radix-scroll-area-viewport]",
      )
      scrollContainer?.scrollTo({
        top: scrollContainer.scrollHeight,
        // behavior: "smooth",
      })
    }, [toJS(chat.messages)])

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
          <PromptInput />
        </div>
      </div>
    )
  },
)
