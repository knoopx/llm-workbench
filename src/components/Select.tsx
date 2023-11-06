import {
  Select as Base,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { observer } from "mobx-react"

export type Option = {
  key: string
  value: string
}

export const Select = observer(
  ({
    className,
    options = [],
    onChange,
    placeholder,
    ...props
  }: {
    className?: string
    value: string
    options: Option[]
    onChange: (value: string) => void
    placeholder?: string
  }) => {
    const sorted = options?.slice().sort((a, b) => a.key.localeCompare(b.key))

    return (
      <Base onValueChange={onChange} {...props}>
        <SelectTrigger className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent className="max-h-64">
          {sorted.map(({ key, value }) => (
            <SelectItem key={key} value={value}>
              {key}
            </SelectItem>
          ))}
        </SelectContent>
      </Base>
    )
  },
)
