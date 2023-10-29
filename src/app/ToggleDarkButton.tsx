import { Button } from "@/components/ui/button"
import { BsFillLightbulbFill, BsLightbulb } from "react-icons/bs"
import { useTheme } from "@/components/ThemeProvider"
import { useStore } from "@/store"

export const ToggleDarkButton = () => {
  const store = useStore()
  const theme = useTheme()

  const toggleTheme = () => {
    theme.setTheme(theme.theme == "dark" ? "light" : "dark")
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {store.theme == "dark" ? <BsFillLightbulbFill /> : <BsLightbulb />}
    </Button>
  )
}
