import { useStore } from "@/store"
import { observer } from "mobx-react"
import { IoMdRefresh } from "react-icons/io"
import { Button } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { humanFileSize } from "@/lib/utils"

export const ChatSettingsModelSelect = observer(
  ({ chat }: { chat: unknown }) => {
    const { models } = useStore()

    return (
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
              {model.name}{" "}
              <span className="text-muted-foreground text-xs italic">
                ({humanFileSize(model.size)})
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  },
)

export const ChatSettingsModelSelector = observer(
  ({ chat }: { chat: unknown }) => {
    const store = useStore()
    return (
      <div className="flex space-x-2">
        <ChatSettingsModelSelect chat={chat} />
        <Button onClick={store.refreshModels}>
          <IoMdRefresh size="1.25em" />
        </Button>
      </div>
    )
  },
)
