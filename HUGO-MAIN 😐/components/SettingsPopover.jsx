"use client"
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import ThemeToggle from "./ThemeToggle"

export default function SettingsPopover({ children }) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start" side="top">
        <div className="p-2">
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <span className="text-sm">Appearance</span>
            <ThemeToggle />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
