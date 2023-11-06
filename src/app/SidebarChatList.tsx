import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useStore } from "@/store"
import { BsChatRightText } from "react-icons/bs"
import { IoMdAdd } from "react-icons/io"
import { observer } from "mobx-react"
import { IoTrashOutline } from "react-icons/io5"
import { SidebarItem } from "@/components/SidebarItem"

export const ChatList = observer(() => {
  const { newChat, removeChat, chats } = useStore()

  // sort chats by recent date
  const sorted = chats
    .slice()
    .sort((a, b) => b.date?.getTime() - a.date?.getTime())

  return (
    <div className="flex-auto space-y-4">
      <div className="flex flex-col px-3 py-2">
        <h2 className="flex mb-2 text-lg font-semibold tracking-tight justify-between items-center">
          <div>Chats</div>
          <Button size="icon" variant="ghost" onClick={newChat}>
            <IoMdAdd />
          </Button>
        </h2>

        {sorted.map((chat) => (
          <SidebarItem
            key={chat.id}
            route="chat"
            resource={chat}
            icon={BsChatRightText}
            actions={
              <a
                className="ml-auto"
                onClick={(e) => {
                  e.stopPropagation()
                  removeChat(chat)
                }}
              >
                <IoTrashOutline />
              </a>
            }
          >
            <div className="flex justify-left items-center space-x-3 mr-3 overflow-hidden">
              {/* {chat.agent && (
                <div className="font-medium truncate">{chat.agent?.name}</div>
              )} */}
              <div className="whitespace-nowrap text-ellipsis truncate italic text-muted-foreground font-normal">
                {chat.title}
              </div>
            </div>
          </SidebarItem>
        ))}
      </div>
    </div>
  )
})
