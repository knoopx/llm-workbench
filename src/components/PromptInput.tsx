import { observer } from "mobx-react"
import { AutoTextarea } from "./AutoTextarea"
import { html2md } from "@/lib/utils"
import { extractHTML } from "@/lib/utils"

export const ChatUserInput = observer(({ chat }) => {
  const handleInput = async (input: string) => {
    if (input.startsWith("http")) {
      const body = await extractHTML(input)
      const md = html2md(body?.outerHTML)
      chat.addMessage({
        content: md,
        role: "user",
      })
    } else {
      chat.send(input)
    }
  }

  return (
    <AutoTextarea
      className="w-full"
      value={chat.prompt}
      onChange={(e) => chat.update({ prompt: e.target.value })}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault()
          chat.update({ prompt: "" })
          handleInput(e.target.value)
        }
      }}
      autoFocus
      placeholder="Enter text..."
    />
  )
})
