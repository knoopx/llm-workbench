import React from "react"
import ReactDOM from "react-dom/client"
import App from "./app/App"
import { Store, StoreContext } from "./store"
import { ThemeProvider } from "./components/ThemeProvider"
import { onSnapshot } from "mobx-state-tree"
import "./index.css"

let data = {}
const raw = window.localStorage.getItem("store")
if (raw) {
  data = JSON.parse(window.localStorage.getItem("store")!)
}
const store = Store.create(data)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <App />
      </ThemeProvider>
    </StoreContext.Provider>
  </React.StrictMode>,
)

onSnapshot(store, (snapshot) => {
  window.localStorage.setItem("store", JSON.stringify(snapshot))
})
