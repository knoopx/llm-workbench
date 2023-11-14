import { Sidebar } from "./Sidebar"
import { observer } from "mobx-react"
import { ActiveRoute } from "./ActiveRoute"

const AppShell = observer(() => {
  return (
    <main className="grid grid-cols-[40ch,auto] auto-rows-fr h-screen overflow-hidden">
      <Sidebar />
      <ActiveRoute />
    </main>
  )
})

export default AppShell
