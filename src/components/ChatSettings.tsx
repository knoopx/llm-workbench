import { SliderCheckbox } from "./SliderCheckbox"
import { observer } from "mobx-react"
import { Select } from "./Select"
import { ModelPicker } from "./ModelPicker"
import { useStore } from "@/store"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TbPrompt } from "react-icons/tb"
import { MdOutlineHistory, MdTune } from "react-icons/md"
import { ImAttachment } from "react-icons/im"
import { Input } from "@/components/ui/input"
import { IoMdAdd, IoMdPerson, IoMdSettings, IoMdTrash } from "react-icons/io"
import { PiTextbox } from "react-icons/pi"
import { Button } from "@/components/ui/button"
import { AutoTextarea } from "./AutoTextarea"
import { AgentPicker } from "./AgentPicker"
import { AttachmentsAccordionItem } from "@/app/AttachmentsAccordionItem"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion"

const ChatSettingsAccordionItem = observer(
  ({ id, icon: Icon, title, children }) => (
    <AccordionItem value={id}>
      <AccordionTrigger className="flex flex-1 text-md items-center justify-between py-1 font-medium transition-all hover:underline">
        <Icon className="mr-2" />
        {title}
      </AccordionTrigger>
      <AccordionContent className="flex flex-col">
        <div className="flex flex-col py-4 space-y-4">{children}</div>
      </AccordionContent>
    </AccordionItem>
  ),
)

const SystemMessageAccordionItem = observer(() => {
  const store = useStore()
  const { activeChat: chat } = store

  return (
    <ChatSettingsAccordionItem
      id="system-message"
      icon={IoMdSettings}
      title="System Message"
    >
      <div className="flex flex-col space-y-2">
        {/* <PresetSelector presets={} onSelect={chat.setSystemMessage} /> */}
        <AutoTextarea
          className="flex-auto h-36"
          placeholder="System Message"
          value={chat.system_message}
          onChange={(e) => chat.setSystemMessage(e.target.value)}
        />
      </div>
    </ChatSettingsAccordionItem>
  )
})

const UserMessageAccordionItem = observer(() => {
  const store = useStore()
  const { activeChat: chat } = store
  return (
    <ChatSettingsAccordionItem
      id="user-message"
      icon={IoMdPerson}
      title="User Message"
    >
      <div className="flex flex-col space-y-2">
        {/* <PresetSelector onSelect={chat.setSystemMessage} /> */}

        <AutoTextarea
          className="flex-auto h-36"
          placeholder="User Message"
          value={chat.user_message}
          onChange={(e) => chat.setUserMessage(e.target.value)}
        />
      </div>
    </ChatSettingsAccordionItem>
  )
})

const PromptTemplateAccordion = observer(() => {
  const store = useStore()
  const { activeChat: chat } = store

  return (
    <ChatSettingsAccordionItem
      id="prompt-template"
      icon={TbPrompt}
      title="Prompt Template"
    >
      <div className="flex flex-col space-y-2">
        <Select presets={store.presets.chat} onChange={chat.setChatTemplate} />
        <AutoTextarea
          className="flex-auto"
          value={chat.chat_template}
          onChange={(e) => chat.setChatTemplate(e.target.value)}
        />
      </div>

      <div className="text-xs font-mono whitespace-pre w-80 overflow-auto">
        {chat.agent.template}
      </div>
    </ChatSettingsAccordionItem>
  )
})

const HistoryMessage = observer(({ message, ...rest }) => (
  <div className="flex space-x-1">
    <Input
      placeholder="role"
      value={message.role}
      onChange={(e) => {
        message.update({ role: e.target.value })
      }}
      {...rest}
    />
    <Input
      placeholder="content"
      value={message.content}
      onChange={(e) => {
        message.update({ content: e.target.value })
      }}
      {...rest}
    />
    <Button onClick={message.remove}>
      <IoMdTrash />
    </Button>
  </div>
))

const ChatHistoryAccordionItem = observer(() => {
  const store = useStore()
  const {
    state: { resource: chat },
  } = store

  return (
    <ChatSettingsAccordionItem
      id="chat-history"
      icon={MdOutlineHistory}
      title="Conversation History"
    >
      <div className="flex space-x-1">
        <Button
          className="flex flex-auto space-x-2"
          onClick={() =>
            chat.addMessage({ role: "system", content: "{{system}}" })
          }
        >
          <IoMdAdd />
          <IoMdSettings />
        </Button>
        <Button
          className="flex flex-auto space-x-2"
          onClick={() => chat.addMessage({ role: "user", content: "{{user}}" })}
        >
          <IoMdAdd />
          <IoMdPerson />
        </Button>
        <Button
          className="flex flex-auto space-x-2"
          onClick={() =>
            chat.addMessage({ role: "user", content: "{{attachments}}" })
          }
        >
          <IoMdAdd />
          <ImAttachment />
        </Button>
        <Button
          className="flex flex-auto space-x-2"
          onClick={() => chat.addMessage({ role: "", content: "" })}
        >
          <IoMdAdd />
          <PiTextbox />
        </Button>
      </div>
      <div className="flex flex-col space-y-1">
        {chat.history.map((message, i) => (
          <HistoryMessage key={i} message={message} />
        ))}
      </div>
    </ChatSettingsAccordionItem>
  )
})

export const ChatSettings = observer(({ chat }) => (
  <ScrollArea>
    <div className="px-4 py-8">
      <AgentPicker chat={chat} />
      <Accordion className="py-4" type="single" defaultValue="attachments">
        <AttachmentsAccordionItem chat={chat} />
      </Accordion>
    </div>
  </ScrollArea>
))
