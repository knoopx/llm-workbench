import React from "react"
import ReactDOM from "react-dom/client"
import AppView from "./app/AppView"
import { Store, StoreContext } from "./store"
import { ThemeProvider } from "./components/ThemeProvider"
import { onSnapshot } from "mobx-state-tree"
import "./index.css"

function loadStore() {
  let data = {}
  const raw = window.localStorage.getItem("store")
  if (raw) {
    data = JSON.parse(window.localStorage.getItem("store")!)
  }
  try {
    return Store.create(data)
  } catch (e) {
    console.error(e)
    if (
      window.confirm(
        "Could not to load application data from local storage, clear it?",
      )
    ) {
      window.localStorage.removeItem("store")
      return Store.create({})
    }

    throw e
  }
}
const store = loadStore()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      <ThemeProvider storageKey="ui-theme">
        <AppView />
      </ThemeProvider>
    </StoreContext.Provider>
  </React.StrictMode>,
)

onSnapshot(store, (snapshot) => {
  window.localStorage.setItem("store", JSON.stringify(snapshot))
})
