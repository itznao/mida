import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  getUserData: () => ipcRenderer.invoke('userData:get'),
  saveUserData: (path, value) => ipcRenderer.invoke('userData:save', path, value),

  getApps: () => ipcRenderer.invoke('apps:get'),
  togglePin: (id) => ipcRenderer.invoke('apps:togglePin', id),

  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close: () => ipcRenderer.send('window:close'),

  openExternal: (url) => ipcRenderer.invoke('open-external', url),

  toggleSidebarHotkey: (callback) => ipcRenderer.on('hotkey:toggleSidebar', callback),
  closeInfoCard: (callback) => ipcRenderer.on('hotkey:closeInfoCard', callback)
})
