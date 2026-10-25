import { useState } from "react"

export function SettingsPage() {
  const [theme, setTheme] = useState("default")
  const [focusKey, setFocusKey] = useState("F2")

  return (
    <div className="relative w-full h-full flex flex-col p-4">
      <div className="relative w-full pb-2 flex items-center">
        <div className="flex flex-col w-full">
          <span className="text-destiny-backup-text text-lg">SETTINGS</span>
          <div className="border-b border-destiny-backup-text flex-1"></div>
        </div>
      </div>

      <div className="bg-black/25 w-full h-12 flex flex-row items-center justify-between">
        <span className="text-destiny-backup-text text-lg pl-4">Theme</span>
        <div className="bg-destiny-background-average w-60 h-12 flex flex-row items-center border border-destiny-backup-text/50"></div>
      </div>

      <div className="relative w-full pb-2 pt-4 flex items-center">
        <div className="flex flex-col w-full">
          <span className="text-destiny-backup-text text-lg">KEYBINDS</span>
          <div className="border-b border-destiny-backup-text flex-1"></div>
        </div>
      </div>

      <div className="bg-black/25 w-full h-12 flex flex-row items-center justify-between">
        <span className="text-destiny-backup-text text-lg pl-4">Focus</span>
        <div className="bg-destiny-background-average w-60 h-12 flex flex-row items-center border border-destiny-backup-text/50"></div>
      </div>
    </div>
  )
}
