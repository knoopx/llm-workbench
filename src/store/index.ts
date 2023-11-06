import { Instance } from "mobx-state-tree"
import { createContext, useContext } from "react"
import { Store } from "./Store"

export { Store }

export const StoreContext = createContext<Instance<typeof Store> | null>(null)

export const useStore = () => {
  return useContext(StoreContext)
}
