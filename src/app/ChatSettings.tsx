import { Textarea } from "../components/ui/textarea"
import { ChatSettingsSlider } from "./ChatSettingsSlider"
import { observer } from "mobx-react"
import { PresetSelector } from "./PresetSelector"
import { ChatSettingsModelSelector } from "./ChatSettingsModelSelector"
import { useStore } from "@/store"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TbPrompt } from "react-icons/tb"
import { MdTune } from "react-icons/md"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ImAttachment } from "react-icons/im"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { processFiles } from "@/lib/extraction"

const FileDropper: React.FC = () => {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = function (e) {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }
  const handleDrop = function (e) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // at least one file has been dropped so do something
      // handleFiles(e.dataTransfer.files);
    }
  }
  return (
    <form
      id="form-file-upload"
      onDragEnter={handleDrag}
      onSubmit={(e) => e.preventDefault()}
    >
      <input type="file" id="input-file-upload" multiple={true} />
      <label
        id="label-file-upload"
        htmlFor="input-file-upload"
        className={dragActive ? "drag-active" : ""}
      >
        <div className="flex w-32 h-32 items-center justify-center border border-dashed rounded-md italic text-muted-foreground text-xs text-center">
          <div>
            Drop your file here or
            <button className="upload-button">Browse</button>
          </div>
        </div>
      </label>
      {dragActive && (
        <div
          id="drag-file-element"
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        ></div>
      )}
    </form>
  )
}

export const ChatSettings = observer(() => {
  const store = useStore()
  const { activeChat: chat } = useStore()

  const handleAttachment = async (e) => {
    const docs = await processFiles(e.target.files)
    chat.setAttachments(docs)
  }

  return (
    <ScrollArea>
      <div className="px-4 py-8">
        <ChatSettingsModelSelector />
        <Accordion className="py-4" type="single" defaultValue="inference">
          <AccordionItem className="" value="inference">
            <AccordionTrigger className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline">
              {/* <ChevronDownIcon aria-hidden /> */}
              <MdTune className="mr-2" />
              Parameters
            </AccordionTrigger>
            <AccordionContent className="flex flex-col space-y-4">
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
                onChange={(value) =>
                  chat.updateOptions({ repeat_penalty: value })
                }
              />
              <ChatSettingsSlider
                id="num_predict"
                label="Max. Tokens"
                value={chat.options.num_predict}
                max={1024 * 8}
                step={256}
                onChange={(value) => chat.updateOptions({ num_predict: value })}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem className="" value="embeddings">
            <AccordionTrigger className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline">
              <ImAttachment className="mr-2" />
              Attachments
            </AccordionTrigger>
            <AccordionContent className="flex flex-col space-y-4">
              <Input type="file" onChange={handleAttachment} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem className="" value="prompts">
            <AccordionTrigger className="flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline">
              {/* <ChevronDownIcon aria-hidden /> */}
              <TbPrompt className="mr-2" />
              Prompts
            </AccordionTrigger>
            <AccordionContent className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-2">
                {/* <PresetSelector onSelect={chat.setSystemMessage} /> */}
                <Label className="flex items-center space-x-2">
                  <Checkbox
                    checked={chat.useSystemMessage}
                    onCheckedChange={chat.setUseSystemMessage}
                  />
                  <span>System Message</span>
                </Label>
                <Textarea
                  className="flex-auto h-36"
                  placeholder="System Message"
                  value={chat.system_message}
                  onChange={(e) => chat.setSystemMessage(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-2">
                {/* <PresetSelector onSelect={chat.setSystemMessage} /> */}
                <Label className="flex items-center space-x-2">
                  <Checkbox
                    checked={chat.useUserMessage}
                    onCheckedChange={chat.setUseUserMessage}
                  />
                  <span>User Message</span>
                </Label>
                <Textarea
                  className="flex-auto h-36"
                  placeholder="User Message"
                  value={chat.user_message}
                  onChange={(e) => chat.setUserMessage(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-2">
                {/* <PresetSelector onSelect={chat.setSystemMessage} /> */}
                <Label className="flex items-center space-x-2">
                  <Checkbox
                    checked={chat.useAssistantMessage}
                    onCheckedChange={chat.setUseAssistantMessage}
                  />
                  <span>Assistant Message</span>
                </Label>
                <Textarea
                  className="flex-auto h-36"
                  placeholder="User Message"
                  value={chat.assistant_message}
                  onChange={(e) => chat.setAssistantMessage(e.target.value)}
                />
              </div>

              <div className="flex flex-col space-y-2">
                <PresetSelector
                  presets={store.presets.chat}
                  onSelect={chat.setChatTemplate}
                />
                <Textarea
                  className="flex-auto font-mono text-xs whitespace-pre h-36"
                  placeholder="Chat Template"
                  value={chat.chat_template}
                  onChange={(e) => chat.setChatTemplate(e.target.value)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </ScrollArea>
  )
})
