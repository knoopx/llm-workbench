import { useStore } from "@/store"
import { AgentView } from "./AgentView"
import { ChatView } from "./ChatView"
import { observer } from "mobx-react"
import { PlaygroundView } from "./PlaygroundView"
import { ScrollArea } from "@radix-ui/react-scroll-area"

export const Router = observer(() => {
  const {
    state: { route, resource },
  } = useStore()

  if (resource) {
    if (route === "chat") {
      return <ChatView />
    } else if (route === "agent") {
      return (
        <div className="overflow-auto">
          <AgentView />
        </div>
      )
    }
  }

  if (route === "playground") {
    return <PlaygroundView />
  }

  return null
})
