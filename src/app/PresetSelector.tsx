import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from "react"
// import Papa from "papaparse"
// useEffect(() => {
//   const fetchPersonas = async () => {
//     const response = await fetch(
//       "https://raw.githubusercontent.com/f/awesome-chatgpt-prompts/main/prompts.csv",
//     )
//     const text = await response.text()
//     const results = Papa.parse(text, { header: true }).data
//     return results.sort((a, b) => a.act.localeCompare(b.act))
//   }

//   fetchPersonas().then(setPersonas)
// }, [])

export const PresetSelector = ({ presets, onSelect }) => {
  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger>
        <SelectValue placeholder="Preset..." />
      </SelectTrigger>

      <SelectContent className="max-h-64">
        {presets.map(({ key, value }) => (
          <SelectItem key={key} value={value}>
            {key}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
