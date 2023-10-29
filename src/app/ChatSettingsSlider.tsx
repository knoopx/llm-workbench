import { Slider } from "../components/ui/slider"
import { Label } from "../components/ui/label"
import { observer } from "mobx-react"

export const ChatSettingsSlider = observer(
  ({ label, id, value, onChange, ...props }) => (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
          {value}
        </span>
      </div>
      <Slider
        id={id}
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
        aria-label={label}
        {...props}
      />
    </div>
  ),
)
