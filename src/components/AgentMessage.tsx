import { observer } from "mobx-react"
import { Button } from "@/components/ui/button"
import { IoMdTrash } from "react-icons/io"
import { Select } from "./Select"
import { AutoTextarea } from "./AutoTextarea"

export const AgentMessage = observer(({ message, ...rest }) => (
  <div className="flex space-x-1 p-2 bg-muted rounded-md">
    <div className="flex flex-auto space-x-2 items-start">
      <Select
        className="text-muted-foreground w-[14ch] h-auto"
        value={message.role}
        options={[
          { key: "User", value: "user" },
          { key: "Assistant", value: "assistant" },
          { key: "System", value: "system" },
        ]}
        onChange={(role) => {
          message.update({ role })
        }}
        {...rest}
      />
      <AutoTextarea
        placeholder="Message..."
        value={message.content}
        category="message"
        onChange={(e) => {
          message.update({ content: e.target.value })
        }}
      />
    </div>
    <Button
      variant="ghost"
      onClick={() => {
        message.agent.removeMessage(message)
      }}
    >
      <IoMdTrash />
    </Button>
  </div>
))
