import { observer } from "mobx-react"
import { ImAttachment } from "react-icons/im"
import { Input } from "@/components/ui/input"
import { processFile } from "@/lib/extraction"
import { AppAccordionItem } from "./AppAccordionItem"
import { Button } from "@/components/ui/button"

export const AttachmentsAccordionItem = observer(({ chat }) => {
  async function processFiles(files: FileList) {
    const results = []
    for (const file of files) {
      console.log(`Processing ${file.name}...`)
      try {
        const content = await processFile(file)
        if (content) {
          results.push({
            name: file.name,
            content,
            path: file.webkitRelativePath ? file.webkitRelativePath : file.name,
            size: file.size,
            type: file.type,
          })
          console.log(file.webkitRelativePath)
        } else {
          console.warn(`File ${file.name} is empty`)
        }
      } catch (e) {
        console.error(e)
      }
    }
    return results
  }

  const handleAttachment = async (e) => {
    const attachments = await processFiles(e.target.files)
    chat.update({ attachments })
    e.target.value = null
  }

  return (
    <AppAccordionItem id="attachments" icon={ImAttachment} title="Attachments">
      <Input
        type="file"
        // webkitdirectory=""
        // mozdirectory=""
        // directory=""
        multiple
        onChange={handleAttachment}
      />
      <Button onClick={() => chat.update({ attachments: [] })}>
        Clear Attachments
      </Button>

      <div>
        {chat.attachments.map((attachment) => (
          <div key={attachment.path} className="text-xs">
            <span>{attachment.path}</span>
          </div>
        ))}
      </div>
    </AppAccordionItem>
  )
})
