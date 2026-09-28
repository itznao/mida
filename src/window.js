const path = require("path");
const { BrowserWindow, ipcMain, shell } = require("electron");
const {
  SIDEBAR_WIDTH,
  TITLEBAR_HEIGHT,
  MAIN_BG,
  VERSION,
} = require("./config");

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    show: false,
    frame: false,
    backgroundColor: MAIN_BG,
    icon: path.join(__dirname, "..", "web", "icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      spellcheck: false,
    },
  });

  win.loadFile(path.join(__dirname, "..", "web", "index.html"), {
    query: {
      "sidebar-width": SIDEBAR_WIDTH,
      "titlebar-height": TITLEBAR_HEIGHT,
    },
  });
  win.once("ready-to-show", () => win.show());

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https:/.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });

  const actions = {
    minimize: () => win.minimize(),
    maximize: () => (win.isMaximized() ? win.unmaximize() : win.maximize()),
    close: () => win.close(),
  };
  ipcMain.on("window", (_event, action) => actions[action]?.());
  ipcMain.handle("version", () => VERSION);
  win.on("maximize", () => win.webContents.send("maximized", true));
  win.on("unmaximize", () => win.webContents.send("maximized", false));

  return win;
}

module.exports = { createWindow };
