import React from "react"
import ReactDOM from "react-dom/client"
import App from "./components/app.tsx"
import "./index.css"
import Store, { StoreContext } from "./store/index.tsx"
import { ThemeProvider } from "./components/theme-provider.tsx"

const store = Store.create()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <App />
      </ThemeProvider>
    </StoreContext.Provider>
  </React.StrictMode>,
)
