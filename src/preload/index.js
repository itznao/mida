import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("api", {
  getSites: () => ipcRenderer.invoke("sites:get"),
  updateSite: (id, changes) => ipcRenderer.invoke("site:update", id, changes),
  minimize: () => ipcRenderer.send("window:minimize"),
  maximize: () => ipcRenderer.send("window:maximize"),
  close: () => ipcRenderer.send("window:close"),
  openExternal: (url) => ipcRenderer.invoke("open-external", url),
  toggleSidebarHotkey: (callback) => ipcRenderer.on("hotkey:toggleSidebar", callback),
  closeInfoCard: (callback) => ipcRenderer.on("hotkey:closeInfoCard", callback)
})
