import { Button } from "@/components/ui/button"
import { useStore } from "@/store"
import { IoMdAdd } from "react-icons/io"
import { observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import { Agent } from "@/store/chat"
import { IoTrashOutline } from "react-icons/io5"
import { PiRobot } from "react-icons/pi"
import { SidebarItem } from "@/components/SidebarItem"

export const AgentList = observer(
  ({ agents }: { agents: Instance<typeof Agent>[] }) => {
    const store = useStore()

    const sorted = agents.slice().sort((a, b) => a.name.localeCompare(b.name))

    return (
      <div className="space-y-4">
        <div className="flex flex-col px-3 py-2">
          <h2 className="flex mb-2 text-lg font-semibold tracking-tight justify-between items-center">
            <span>Agents</span>
            <Button size="icon" variant="ghost" onClick={store.newAgent}>
              <IoMdAdd />
            </Button>
          </h2>

          {sorted.map((agent) => (
            <SidebarItem
              key={agent.id}
              route="agent"
              resource={agent}
              icon={PiRobot}
              actions={
                <a
                  className="ml-auto"
                  onClick={(e) => {
                    e.stopPropagation()
                    store.removeAgent(agent)
                  }}
                >
                  <IoTrashOutline />
                </a>
              }
            >
              {agent.name ? (
                agent.name
              ) : (
                <span className="italic">(No Name)</span>
              )}
            </SidebarItem>
          ))}
        </div>
      </div>
    )
  },
)
