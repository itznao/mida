const { contextBridge, ipcRenderer } = require("electron");

const listen = (channel, callback) =>
  ipcRenderer.on(channel, (_event, value) => callback(value));

contextBridge.exposeInMainWorld("mida", {
  getTools: () => ipcRenderer.invoke("tools"),
  getVersion: () => ipcRenderer.invoke("version"),
  show: (id) => ipcRenderer.send("show", id),
  toggleMenu: () => ipcRenderer.send("toggle-menu"),
  onMenu: (callback) => listen("menu", callback),
  getActiveTab: () => ipcRenderer.invoke("active-tab"),
  onActiveTab: (callback) => listen("active-tab", callback),

  isLoggedIn: () => ipcRenderer.invoke("auth"),
  onAuth: (callback) => listen("auth", callback),
  login: () => ipcRenderer.send("login"),
  logout: () => ipcRenderer.send("logout"),

  minimize: () => ipcRenderer.send("window", "minimize"),
  maximize: () => ipcRenderer.send("window", "maximize"),
  onMaximized: (callback) => listen("maximized", callback),
  close: () => ipcRenderer.send("window", "close"),

  toastSize: (size) => ipcRenderer.send("toast-size", size),
  closeToast: () => ipcRenderer.send("close-toast"),
  openLink: () => ipcRenderer.send("open-link"),
});
