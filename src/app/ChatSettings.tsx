import { Textarea } from "../components/ui/textarea"
import { ChatSettingsSlider } from "./ChatSettingsSlider"
import { observer } from "mobx-react"
import { PresetSelector } from "./PresetSelector"
import { ChatSettingsModelSelector } from "./ChatSettingsModelSelector"
import { useStore } from "@/store"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TbPrompt } from "react-icons/tb"
import { MdOutlineHistory, MdTune } from "react-icons/md"
import { ImAttachment } from "react-icons/im"
import { Input } from "@/components/ui/input"
import { processFiles } from "@/lib/extraction"
import { IoMdAdd, IoMdPerson, IoMdSettings, IoMdTrash } from "react-icons/io"
import { PiTextbox } from "react-icons/pi"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion"
import AutoTextarea from "./AutoTextarea"

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

// const AssistantMessageAccordion = observer(() => {
//   const store = useStore()
//   const { activeChat: chat } = store

//   return (
//     <div className="flex flex-col space-y-2">
//       {/* <PresetSelector onSelect={chat.setSystemMessage} /> */}
//       <Label className="flex items-center space-x-2">
//         <Checkbox
//           checked={chat.useAssistantMessage}
//           onCheckedChange={chat.setUseAssistantMessage}
//         />
//         <span>Assistant Message</span>
//       </Label>
//       <Textarea
//         className="flex-auto h-36"
//         placeholder="User Message"
//         value={chat.assistant_message}
//         onChange={(e) => chat.setAssistantMessage(e.target.value)}
//       />
//     </div>
//   )
// })

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
        <PresetSelector
          presets={store.presets.chat}
          onSelect={chat.setChatTemplate}
        />
        <AutoTextarea
          className="flex-auto font-mono text-xs whitespace-pre h-36"
          placeholder="Chat Template"
          value={chat.chat_template}
          onChange={(e) => chat.setChatTemplate(e.target.value)}
        />
      </div>

      <div className="text-xs font-mono whitespace-pre w-80 overflow-auto">
        {chat.template}
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
  const { activeChat: chat } = store

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
            chat.addHistoryMessage({ role: "system", content: "{{system}}" })
          }
        >
          <IoMdAdd />
          <IoMdSettings />
        </Button>
        <Button
          className="flex flex-auto space-x-2"
          onClick={() =>
            chat.addHistoryMessage({ role: "user", content: "{{user}}" })
          }
        >
          <IoMdAdd />
          <IoMdPerson />
        </Button>
        <Button
          className="flex flex-auto space-x-2"
          onClick={() =>
            chat.addHistoryMessage({ role: "user", content: "{{attachments}}" })
          }
        >
          <IoMdAdd />
          <ImAttachment />
        </Button>
        <Button
          className="flex flex-auto space-x-2"
          onClick={() => chat.addHistoryMessage({ role: "", content: "" })}
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

const AttachmentsAccordionItem = observer(() => {
  const store = useStore()
  const { activeChat: chat } = store

  const handleAttachment = async (e) => {
    const docs = await processFiles(e.target.files)
    chat.setAttachments(docs)
  }

  return (
    <ChatSettingsAccordionItem
      id="embeddings"
      icon={ImAttachment}
      title="Attachments"
    >
      <Input type="file" multiple onChange={handleAttachment} />
    </ChatSettingsAccordionItem>
  )
})

const InferenceParamsAccordionItem = observer(() => {
  const store = useStore()
  const { activeChat: chat } = store

  return (
    <ChatSettingsAccordionItem id="inference" icon={MdTune} title="Parameters">
      <div className="mb-3 space-y-2">
        <PresetSelector
          presets={store.presets.inference}
          onSelect={chat.updateOptions}
        />
        <ChatSettingsSlider
          id="temperature"
          label="Temperature"
          value={chat.options.temperature}
          max={1}
          step={0.1}
          onChange={(value) => chat.updateOptions({ temperature: value })}
        />
        <ChatSettingsSlider
          id="top_k"
          label="Top K"
          value={chat.options.top_k}
          max={1}
          step={0.1}
          onChange={(value) => chat.updateOptions({ top_k: value })}
        />
        <ChatSettingsSlider
          id="top_p"
          label="Top P"
          value={chat.options.top_p}
          max={1}
          step={0.1}
          onChange={(value) => chat.updateOptions({ top_p: value })}
        />
        <ChatSettingsSlider
          id="repeat_penalty"
          label="Reptition Penalty"
          value={chat.options.repeat_penalty}
          max={2}
          step={0.1}
          onChange={(value) => chat.updateOptions({ repeat_penalty: value })}
        />
        <ChatSettingsSlider
          id="num_predict"
          label="Max. Tokens"
          value={chat.options.num_predict}
          max={1024 * 8}
          step={64}
          onChange={(value) => chat.updateOptions({ num_predict: value })}
        />
      </div>
    </ChatSettingsAccordionItem>
  )
})

export const ChatSettings = observer(() => (
  <ScrollArea>
    <div className="px-4 py-8">
      <ChatSettingsModelSelector />
      <Accordion className="py-4" type="single" defaultValue="inference">
        <InferenceParamsAccordionItem />
        <AttachmentsAccordionItem />
        <SystemMessageAccordionItem />
        <UserMessageAccordionItem />
        {/*
        <AssistantMessageAccordion /> */}
        <ChatHistoryAccordionItem />
        <PromptTemplateAccordion />
      </Accordion>
    </div>
  </ScrollArea>
))
