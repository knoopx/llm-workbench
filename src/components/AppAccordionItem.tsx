import { observer } from "mobx-react"
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion"

export const AppAccordionItem = observer(
  ({ id, icon: Icon, title, children }) => (
    <AccordionItem value={id}>
      <AccordionTrigger className="flex flex-1 text-md items-center justify-between py-1 font-medium transition-all hover:underline">
        <Icon className="mr-2" />
        {title}
      </AccordionTrigger>
      <AccordionContent className="flex flex-col">
        <div className="flex flex-col py-4 space-y-4">{children}</div>
      </AccordionContent>
    </AccordionItem>
  ),
)
