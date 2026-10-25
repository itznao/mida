import { app, shell, BrowserWindow, ipcMain, dialog } from "electron"
import { join } from "path"
import { electronApp, optimizer, is } from "@electron-toolkit/utils"
import { autoUpdater } from "electron-updater"
import icon from "../../resources/icon.png?asset"
import { fetchSites } from "./fetchSites"
import { updateSite } from "./updateSite"
import { setupHotkeys } from "./hotkeys"

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    minWidth: 900,
    minHeight: 500,
    show: false,
    autoHideMenuBar: true,
    icon,
    frame: false,
    webPreferences: {
      partition: "persist:bungie",
      preload: join(__dirname, "../preload/index.js"),
      true: false,
      webviewTag: true
    }
  })

  mainWindow.on("ready-to-show", () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: "deny" }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"])
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"))
  }

  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("itznao.mida")

  try {
    const result = await autoUpdater.checkForUpdates()

    if (result?.isUpdateAvailable) {
      autoUpdater.on("update-downloaded", () => autoUpdater.quitAndInstall())
    }
  } catch (error) {
    dialog.showErrorBox("Update Failed", error.message)
    app.quit()
    return
  }

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  app.on("web-contents-created", (_, contents) => {
    contents.setWindowOpenHandler(() => ({
      action: "allow",
      overrideBrowserWindowOptions: { icon }
    }))
    contents.on("did-create-window", (win) => win.removeMenu())
  })

  ipcMain.handle("sites:get", async (_) => {
    const sites = await fetchSites()
    return sites
  })

  ipcMain.handle("site:update", async (_, id, changes) => {
    const sites = await updateSite(id, changes)
    return sites
  })

  ipcMain.on("window:minimize", (_) => {
    BrowserWindow.getFocusedWindow()?.minimize()
  })

  ipcMain.on("window:maximize", (_) => {
    const win = BrowserWindow.getFocusedWindow()
    if (!win) return

    win.isMaximized() ? win.unmaximize() : win.maximize()
  })

  ipcMain.on("window:close", (_) => {
    BrowserWindow.getFocusedWindow()?.close()
  })

  ipcMain.handle("open-external", async (_, url) => {
    if (typeof url === "string" && url.startsWith("https://")) {
      await shell.openExternal(url)
    }
  })

  const mainWindow = createWindow()

  setupHotkeys(mainWindow)

  app.on("activate", function () {
    // On macOS it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it"s common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
