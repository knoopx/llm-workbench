import { cn } from "@/lib/utils"
import { observer } from "mobx-react"

export const ActionOverlay = observer(
  ({
    children,
    actions,
    className,
  }: {
    children: React.ReactNode
    actions: React.ReactNode
    className?: string
  }) => (
    <div className="flex flex-auto relative">
      {children}
      <div
        className={cn(
          "absolute top-0 right-0 bottom-0 flex items-start justify-center",
          className,
        )}
      >
        {actions}
      </div>
    </div>
  ),
)
