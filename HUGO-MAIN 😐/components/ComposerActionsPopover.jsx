"use client"
import { useState } from "react"
import { Paperclip } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

export default function ComposerActionsPopover({ children }) {
  const [open, setOpen] = useState(false)

  const handleAction = (action) => {
    action()
    setOpen(false)
  }

  const mainActions = [
    {
      icon: Paperclip,
      label: "Add photos & files",
      action: () => console.log("Add photos & files"),
    },
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="start" side="top">
        <div className="p-1">
          {mainActions.map((action, index) => {
            const IconComponent = action.icon
            return (
              <button
                key={index}
                onClick={() => handleAction(action.action)}
                className="flex items-center gap-3 w-full p-2 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
              >
                <IconComponent className="h-4 w-4" />
                <span>{action.label}</span>
              </button>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}
