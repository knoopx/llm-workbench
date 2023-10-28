import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export function Sidebar({
  className,
  chats,
}: {
  className?: string
  chats: any[]
}) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Chats
          </h2>
          {chats.map((chat) => (
            <Button
              key={chat.id}
              className="w-full text-left"
              onClick={() => chat.setActive()}
            >
              {chat.model}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
