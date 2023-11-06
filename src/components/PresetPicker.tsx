import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { observer } from "mobx-react"
import { TbSelector } from "react-icons/tb"
import { HiOutlineDocumentDownload } from "react-icons/hi"

export const NewComponent: React.FC<{
  onSelect: (preset: any) => void
  presets: any[]
}> = ({ onSelect, presets }) => {
  if (presets.length === 0) {
    return (
      <DropdownMenuItem disabled className="italic">
        No presets
      </DropdownMenuItem>
    )
  }
  return (
    <>
      {presets.map((preset) => (
        <DropdownMenuItem onClick={() => onSelect(preset.value)}>
          <span>{preset.key}</span>
        </DropdownMenuItem>
      ))}
    </>
  )
}

export const PresetPicker = observer(
  ({
    presets = [],
    onSelect,
  }: {
    presets: any[]
    onSelect: (preset: any) => void
  }) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button>
            <HiOutlineDocumentDownload size="1.2em" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start" className="w-56">
          <NewComponent onSelect={onSelect} presets={presets} />
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
)
