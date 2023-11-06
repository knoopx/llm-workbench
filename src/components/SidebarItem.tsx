import { cn } from "@/lib/utils"
import { useStore } from "@/store"
import { observer } from "mobx-react"

export const SidebarItem = observer(
  ({
    children,
    icon: Icon,
    route,
    resource,
    actions,
    ...props
  }: {
    children: React.ReactNode
  }) => {
    const { state } = useStore()

    return (
      <button
        {...props}
        onClick={() => state.navigate(resource ?? route)}
        className={cn("flex items-center w-full text-sm px-4 py-2 rounded", {
          "bg-secondary":
            state.route === route &&
            (resource ? state.resource === resource : true),
        })}
      >
        <div className="flex flex-auto items-center space-x-3 overflow-hidden">
          {Icon && <Icon className="flex-none" size="1em" />}
          <div className="flex-auto font-medium truncate text-left">
            {children}
          </div>
          {actions && <div className="ml-auto">{actions}</div>}
        </div>
      </button>
    )
  },
)
