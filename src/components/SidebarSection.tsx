import { observer } from "mobx-react"

export const SidebarSection = observer(
  ({ title, actions, children }: { children: React.ReactNode }) => (
    <div className="space-y-4">
      <div className="flex flex-col px-3 py-2">
        <h2 className="flex mb-2 text-lg font-semibold tracking-tight justify-between items-center">
          <span>{title}</span>
          {actions}
        </h2>

        {children}
      </div>
    </div>
  ),
)
