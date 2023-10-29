import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useStore } from "@/store"
import { BsChatRightTextFill } from "react-icons/bs"
import { IoMdAdd } from "react-icons/io"
import { observer } from "mobx-react"
import { Instance } from "mobx-state-tree"
import { Chat } from "@/store/chat"
import { IoTrashOutline } from "react-icons/io5"

export const ChatList = observer(
  ({ chats }: { chats: Instance<typeof Chat>[] }) => {
    const store = useStore()
    return (
      <div className="flex-auto space-y-4">
        <div className="px-3 py-2">
          <h2 className="flex mb-2 text-lg font-semibold tracking-tight justify-between items-center">
            <span>Chats</span>
            <Button size="icon" variant="ghost" onClick={store.newChat}>
              <IoMdAdd />
            </Button>
          </h2>

          {chats.map((chat) => (
            <button
              key={chat.id}
              className={cn(
                "flex items-center w-full text-sm px-4 py-2 rounded",
                {
                  "bg-secondary": store.activeChat === chat,
                },
              )}
              onClick={() => store.setActiveChat(chat)}
            >
              <span className="flex justify-left items-center space-x-3 mr-3 overflow-hidden">
                <BsChatRightTextFill className="flex-none" size="1em" />
                <span className="font-medium truncate">{chat.model}</span>

                <span className="whitespace-nowrap text-ellipsis truncate italic text-muted-foreground">
                  {chat.title}
                s</span>
              </span>
              <a
                className="ml-auto"
                onClick={(e) => {
                  e.stopPropagation()
                  store.removeChat(chat)
                }}
              >
                <IoTrashOutline />
              </a>
            </button>
          ))}
        </div>
      </div>
    )
  },
)
