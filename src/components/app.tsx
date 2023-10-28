import Markdown from "react-markdown"

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { Input } from "@/components/ui/input"
import { Sidebar } from "./sidebar"
import { observer } from "mobx-react"
import { Slider } from "./ui/slider"
import { Label } from "./ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

import { useStore } from "@/store"
import { Button } from "./ui/button"
import { IoMdTrash } from "react-icons/io"
import { Chat } from "@/store/chat"
import { Instance } from "mobx-state-tree"
import { cn } from "@/lib/utils"
import { BiSolidUser } from "react-icons/bi"
import { ScrollArea } from "./ui/scroll-area"

import { shadesOfPurple } from "react-syntax-highlighter/dist/esm/styles/hljs"

const OptionSlider = observer(({ label, id, value, onChange, ...props }) => (
  <div className="grid gap-4">
    <div className="flex items-center justify-between">
      <Label htmlFor={id}>{label}</Label>
      <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
        {value}
      </span>
    </div>
    <Slider
      id={id}
      defaultValue={[value]}
      onValueChange={onChange}
      className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
      aria-label={label}
      {...props}
    />
  </div>
))

const Message = observer(({ role, content, date }) => (
  <div className="flex space-x-4 px-8 py-4">
    <div className="flex flex-col">
      <span
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center -my-1",
          {
            "bg-white text-black font-extrabold ": role === "assistant",
            "text-gray-600": role === "user",
          },
        )}
      >
        {role == "user" ? <BiSolidUser size="1.5em" /> : role[0].toUpperCase()}
      </span>
      {/* <div className="font-medium w-32">{role}</div>
      <div className="text-muted text-xs">{date.toLocaleTimeString()}</div> */}
    </div>
    <div className="flex-auto">
      <Markdown
        className={cn("prose dark:prose-invert", {
          "italic font-medium text-gray-600": role === "user",
        })}
        components={{
          code(props) {
            const { children, className, node, ...rest } = props
            const match = /language-(\w+)/.exec(className || "")
            return (
              <SyntaxHighlighter
                {...rest}
                className="rounded-md my-2"
                children={String(children).replace(/\n$/, "")}
                style={shadesOfPurple}
                language={match ? match[1] : ""}
                PreTag="div"
              />
            )
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  </div>
))

const ChatView = observer(({ chat }: { chat: Instance<typeof Chat> }) => {
  const { models } = useStore()
  return (
    <div className="grid grid-cols-[auto,16em] auto-rows-fr divide-x-2">
      <div className="flex flex-col">
        <ScrollArea>
          <div className="mx-auto w-3/5">
            {chat.messages.map((message, i) => (
              <Message key={i} {...message} />
            ))}
          </div>
        </ScrollArea>
        <div className="flex-none flex items-center space-x-4 p-8 min-h-0">
          <form className="flex-auto flex" onSubmit={chat.onSubmit}>
            <Input autoFocus placeholder="Enter text..." />
          </form>
          <Button onClick={chat.onClearConversation}>
            <IoMdTrash size="1.5em" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Select
          id="model"
          onValueChange={chat.setModel}
          defaultValue={chat.model}
        >
          <SelectTrigger>
            <SelectValue placeholder="Model" />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.digest} value={model.name}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <OptionSlider
          id="temperature"
          label="Temperature"
          value={chat.options.temperature}
          max={1}
          step={0.1}
          onChange={(value) => chat.updateOptions({ temperature: value })}
        />
        <OptionSlider
          id="maxTokens"
          label="Max. Tokens"
          value={chat.options.maxTokens}
          max={1028 * 8}
          step={8}
          onChange={(value) => chat.updateOptions({ temperature: value })}
        />
      </div>
    </div>
  )
})

const App = observer(() => {
  const { activeChat, chats } = useStore()

  return (
    <main className="grid grid-cols-[16em,auto] auto-rows-fr divide-x-2 h-screen">
      <Sidebar chats={chats} />
      {activeChat && <ChatView chat={activeChat} />}
    </main>
  )
})

export default App
