import { cn } from "@/lib/utils"
import { useStore } from "@/store"
import { observer } from "mobx-react"
import { ChatList } from "./SidebarChatList"
import { Input } from "@/components/ui/input"
import { IoIosFlash } from "react-icons/io"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { MdEdit } from "react-icons/md"

const ConnectButton = observer(() => {
  const store = useStore()

  return (
    <Button
      size="sm"
      onClick={() => {
        store?.refreshModels()
      }}
    >
      <IoIosFlash size="1.2em" />
    </Button>
  )
})

const DisconnectButton = observer(() => {
  const store = useStore()

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={() => {
        store?.setConnected(false)
      }}
    >
      <MdEdit size="1.2em" />
    </Button>
  )
})

export const Sidebar = observer(
  ({ className, chats }: { className?: string; chats: any[] }) => {
    const store = useStore()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      store?.refreshModels()
    }

    return (
      <form
        onSubmit={handleSubmit}
        className={cn("flex flex-col divide-y-1 border-r-1", className)}
      >
        <ChatList chats={chats} />
        <div className="flex justify-between items-center space-x-2 px-3 py-2">
          {store?.connected ? (
            <Label>
              <span className="text-muted-foreground">{store.endpoint}</span>
            </Label>
          ) : (
            <Input
              className="h-auto"
              value={store.endpoint}
              onChange={store.setEndpoint}
            />
          )}

          {store?.connected ? <DisconnectButton /> : <ConnectButton />}
        </div>
      </form>
    )
  },
)
