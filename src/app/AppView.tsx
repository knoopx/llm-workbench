import { Sidebar } from "./Sidebar"
import { observer } from "mobx-react"
import { Router } from "./Router"

const AppView = observer(() => {
  return (
    <main className="grid grid-cols-[20em,auto] auto-rows-fr h-screen">
      <Sidebar />
      <Router />
    </main>
  )
})

export default AppView
