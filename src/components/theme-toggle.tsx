"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"

    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setTheme(newTheme)
      })
    } else {
      setTheme(newTheme)
    }
  }

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="h-9 w-9 bg-transparent">
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 group relative overflow-hidden transition-all duration-300 hover:scale-110 active:scale-95 bg-transparent"
    >
      <Sun className="h-4 w-4 absolute inset-0 m-auto rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
      <Moon className="h-4 w-4 absolute inset-0 m-auto rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Tema değiştir</span>
    </Button>
  )
}
