import { cn } from "@/lib/utils"
import { useStore } from "@/store"
import { observer } from "mobx-react"
import { ChatList } from "./SidebarChatList"
import { Input } from "@/components/ui/input"
import { IoIosFlash, IoIosFlashOff } from "react-icons/io"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export const Sidebar = observer(
  ({ className, chats }: { className?: string; chats: any[] }) => {
    const store = useStore()

    return (
      <div className={cn("flex flex-col divide-y-1 border-r-1", className)}>
        <ChatList chats={chats} />
        <div className="flex justify-between items-center space-x-2 px-3 py-2">
          {store?.connected ? (
            <Label>
              <span className="text-muted-foreground">{store.endpoint}</span>
            </Label>
          ) : (
            <Input value={store.endpoint} onChange={store.setEndpoint} />
          )}
          <Button size="sm">
            {store?.connected ? <IoIosFlashOff /> : <IoIosFlash />}
          </Button>
        </div>
      </div>
    )
  },
)
