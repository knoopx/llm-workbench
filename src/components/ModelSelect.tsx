import { observer } from "mobx-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { humanFileSize } from "@/lib/utils"

export const ModelSelect = observer(({ agent, ...props }) => {
  const { models } = agent.adapter

  return (
    <Select
      {...props}
      value={agent.model}
      onValueChange={(model) => agent.update({ model })}
    >
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model.name} value={model.name}>
            <div className="whitespace-nowrap overflow-hidden flex flex-auto space-x-2 items-center">
              <div className="truncate text-ellipsis">{model.name}</div>
              <div className="flex-auto text-muted-foreground text-xs italic">
                {humanFileSize(model.size)}
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
})
