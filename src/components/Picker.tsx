import { observer } from "mobx-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

export const Picker = observer(
  ({
    options,
    value,
    onChange,
    ...props
  }: {
    onChange: (option: string) => void
    options: { key: string; value: string }[]
  }) => {
    return (
      <Select
        {...props}
        value={value}
        onValueChange={(option) => onChange(option)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.key} value={option.value}>
              <div className="whitespace-nowrap overflow-hidden flex flex-auto space-x-2 items-center">
                {option.value}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  },
)
