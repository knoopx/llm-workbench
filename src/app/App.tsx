import { Sidebar } from "./Sidebar"
import { observer } from "mobx-react"
import { useStore } from "@/store"
import { ChatWithSettings } from "./ChatWithSettings"

const App = observer(() => {
  const { connected, activeChat, chats } = useStore()

  return (
    <main className="grid grid-cols-[20em,auto] auto-rows-fr h-screen">
      <Sidebar chats={chats} />
      {connected && activeChat && <ChatWithSettings chat={activeChat} />}
    </main>
  )
})

export default App
