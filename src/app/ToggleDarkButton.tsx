import { Button } from "@/components/ui/button"
import { BsFillLightbulbFill, BsLightbulb } from "react-icons/bs"
import { useTheme } from "@/components/ThemeProvider"

export const ToggleDarkButton = () => {
  const theme = useTheme()

  const toggleTheme = () => {
    theme.setTheme(theme.theme == "dark" ? "light" : "dark")
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {theme.theme == "dark" ? (
        <BsFillLightbulbFill size="1.5em" />
      ) : (
        <BsLightbulb size="1.5em" />
      )}
    </Button>
  )
}
