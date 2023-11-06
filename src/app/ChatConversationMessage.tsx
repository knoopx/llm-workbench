import Markdown from "react-markdown"
import { cn } from "@/lib/utils"
import { TbPrompt } from "react-icons/tb"
import { cloneElement, useEffect, useRef } from "react"
import { observer, useLocalStore } from "mobx-react"

import remarkMath from "remark-math"
import remarkGfm from "remark-gfm"
import remarkEmoji from "remark-emoji"
import rehypeHighlight from "rehype-highlight"
import rehypeKatex from "rehype-katex"

import "katex/dist/katex.min.css"
import "highlight.js/styles/github-dark.css"
import { ActionOverlay } from "@/components/ActionOverlay"
import { IoMdCopy, IoMdMore, IoMdTrash } from "react-icons/io"
import { AiOutlineEdit } from "react-icons/ai"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AutoTextarea } from "@/components/AutoTextarea"
import { Instance } from "mobx-state-tree"
import { Chat } from "@/store/Chat"

const MessagePreview: React.FC<{
  content: string
  role: string
}> = observer(({ content, role }) => (
  <Markdown
    remarkPlugins={[remarkEmoji, remarkGfm, remarkMath]}
    rehypePlugins={[rehypeHighlight, rehypeKatex]}
    className={cn("prose dark:prose-invert min-w-[65ch]", {
      "text-muted-foreground": role === "user",
      "italic text-muted-foreground": role === "system",
    })}
    components={{
      pre({ node, children, ...rest }) {
        return (
          <pre {...rest} className="text-xs">
            {cloneElement(children, {
              className: cn(
                "rounded-md p-4 !bg-gray-900",
                children.props.className,
              ),
            })}
          </pre>
        )
      },
    }}
  >
    {content}
  </Markdown>
))

const EmptyMessage: React.FC<{
  message: Instance<typeof ChatConversationMessage>
}> = observer(({ message }) => (
  <div
    className={cn("min-w-[65ch]", {
      "animate-pulse": message.chat.isRunning,
    })}
  >
    ...
  </div>
))

const MessageDropdownMenu: React.FC<{
  children: React.ReactNode
}> = observer(({ children }) => (
  <div className="mt-2.5 -mr-2">
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto px-2">
          <IoMdMore />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>{children}</DropdownMenuContent>
    </DropdownMenu>
  </div>
))

const MessageAvatar: React.FC<{
  chat: Instance<typeof Chat>
  role: string
}> = observer(({ chat, role }) => (
  <div className="flex flex-col">
    <span
      className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center -my-1",
        {
          "dark:bg-white dark:text-black bg-black text-white font-extrabold ":
            role === "assistant",
          "text-muted-foreground": role === "user",
          "animate-pulse": role === "assistant" && chat.isRunning,
        },
      )}
    >
      {role !== "system" &&
        (role == "user" ? <TbPrompt size="1.5em" /> : role[0].toUpperCase())}
    </span>
  </div>
))

export const ChatConversationMessage = observer(({ message }) => {
  const { role, content, isEmpty, chat } = message

  const state = useLocalStore(() => ({
    isEditing: false,
    setEditing(value: boolean) {
      state.isEditing = value
    },
  }))

  return (
    <ActionOverlay
      actions={
        <MessageDropdownMenu>
          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(content)
            }}
          >
            <IoMdCopy className="mr-2 h-4 w-4" />
            <span>Copy to clipboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              state.setEditing(true)
            }}
          >
            <AiOutlineEdit className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              message.chat.remove(message)
            }}
          >
            <IoMdTrash className="mr-2 h-4 w-4" />
            <span>Remove</span>
          </DropdownMenuItem>
        </MessageDropdownMenu>
      }
    >
      <div className="flex flex-auto space-x-4 px-8 py-4 w-full">
        <MessageAvatar chat={chat} role={role} />
        <div className="flex flex-auto w-[65ch]">
          {state.isEditing ? (
            <AutoTextarea
              value={content}
              maxRows={20}
              onChange={(e) => message.update({ content: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  state.setEditing(false)
                  message.update({ content: e.target.value })
                }
              }}
            />
          ) : isEmpty ? (
            <EmptyMessage message={message} />
          ) : (
            <MessagePreview content={content} role={role} />
          )}
        </div>
      </div>
    </ActionOverlay>
  )
})
