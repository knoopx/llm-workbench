import { Slider as Base } from "./ui/slider"
import { Label } from "./ui/label"
import { observer } from "mobx-react"
import { Checkbox } from "./ui/checkbox"
import { cn } from "@/lib/utils"
import { Input } from "./ui/input"

export const SliderCheckbox = observer(
  ({ label, id, value, onChange, checked, onCheckedChange, ...props }) => (
    <div
      className={cn("grid gap-1", {
        "opacity-25": !checked,
      })}
    >
      <div className="flex items-center justify-between">
        <Label className="flex items-center space-x-2">
          <Checkbox checked={checked} onCheckedChange={onCheckedChange} />
          <span>{label}</span>
        </Label>
        <Input
          className="h-auto w-12 rounded-md border border-transparent !px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border"
          value={value}
          onChange={(e) => {
            onCheckedChange(true)
            onChange(Number(e.target.value))
          }}
        />
      </div>
      <Base
        id={id}
        value={[value]}
        onValueChange={(v) => {
          onCheckedChange(true)
          onChange(v[0])
        }}
        className="ml-6 [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
        aria-label={label}
        {...props}
      />
    </div>
  ),
)
