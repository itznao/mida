import { app, shell, BrowserWindow, ipcMain, dialog, session } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { autoUpdater } from 'electron-updater'
import icon from '../../resources/icon.png?asset'
import { loadApps, togglePin, loadUserData, saveUserData } from './store'
import { setupKeybinds } from './keybinds'
import { readdirSync, existsSync } from 'fs'
import { welcomeCard, updateCard } from './cards'

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
      partition: 'persist:midaContentSession',
      preload: join(__dirname, '../preload/index.js'),
      true: false,
      webviewTag: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('itznao.mida')

  const partitionsPath = join(app.getPath('userData'), 'Partitions')
  const hasUsedMidaBefore = existsSync(partitionsPath) && readdirSync(partitionsPath).length !== 0

  const lastVersion = loadUserData().flags.lastVersionOpened
  const justUpdated = lastVersion !== app.getVersion()

  if (justUpdated) {
    console.log(`Updated from ${lastVersion} to ${app.getVersion()}.`)
    saveUserData(['flags', 'lastVersionOpened'], app.getVersion())
  }

  try {
    const result = await autoUpdater.checkForUpdates()

    if (result?.isUpdateAvailable) {
      autoUpdater.on('update-downloaded', () => autoUpdater.quitAndInstall())
    }
  } catch (error) {
    dialog.showErrorBox('Update Failed', error.message)
    app.quit()
    return
  }

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  app.on('web-contents-created', (_, contents) => {
    contents.setWindowOpenHandler(() => ({
      action: 'allow',
      overrideBrowserWindowOptions: { icon }
    }))
    contents.on('did-create-window', (win) => win.removeMenu())
  })

  ipcMain.handle('userData:get', (_) => loadUserData())
  ipcMain.handle('userData:save', (_, path, value) => saveUserData(path, value))
  ipcMain.handle('apps:get', (_) => loadApps())
  ipcMain.handle('apps:togglePin', (_, id) => togglePin(id))

  ipcMain.on('window:minimize', (_) => {
    BrowserWindow.getFocusedWindow()?.minimize()
  })

  ipcMain.on('window:maximize', (_) => {
    const win = BrowserWindow.getFocusedWindow()
    if (!win) return

    win.isMaximized() ? win.unmaximize() : win.maximize()
  })

  ipcMain.on('window:close', (_) => {
    BrowserWindow.getFocusedWindow()?.close()
  })

  ipcMain.handle('open-external', async (_, url) => {
    if (typeof url === 'string' && url.startsWith('https://')) {
      await shell.openExternal(url)
    }
  })

  const midaContentSession = session.fromPartition('persist:midaContentSession')

  midaContentSession.cookies.on('changed', (_, cookie, __, removed) => {
    if (removed || !cookie.session || !cookie.domain.endsWith('bungie.net')) return

    midaContentSession.cookies
      .set({
        url: `https://${cookie.domain.replace(/^\./, '')}${cookie.path}`,
        name: cookie.name,
        value: cookie.value,
        domain: cookie.hostOnly ? undefined : cookie.domain,
        path: cookie.path,
        secure: cookie.secure,
        httpOnly: cookie.httpOnly,
        sameSite: cookie.sameSite,
        expirationDate: Date.now() / 1000 + 30 * 24 * 60 * 60
      })
      .catch((err) => console.log('Cookie save failed:', cookie.name, err.message))

    console.log('Updated bungie.net cookie to last for 30 days.')
  })

  const mainWindow = createWindow()

  setupKeybinds(mainWindow)

  ipcMain.once('app:ready', () => {
    if (!hasUsedMidaBefore) {
      mainWindow.webContents.send('infoCard:send', welcomeCard)
    } else if (justUpdated) {
      mainWindow.webContents.send('infoCard:send', updateCard)
    }
  })

  app.on('activate', function () {
    // On macOS it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

const loginPlatforms = [
  'steamcommunity.com',
  'steampowered.com',
  'steam.tv',
  'sony.com',
  'playstation.com',
  'live.com',
  'microsoftonline.com',
  'epicgames.com',
  'twitch.tv'
]

function isLoginCookie(cookie) {
  const domain = cookie.domain.replace(/^\./, '')
  return loginPlatforms.some((site) => domain === site || domain.endsWith('.' + site))
}

async function clearLoginCookies() {
  const contentSession = session.fromPartition('persist:midaContentSession')
  const cookies = await contentSession.cookies.get({})

  for (const cookie of cookies.filter(isLoginCookie)) {
    const domain = cookie.domain.replace(/^\./, '')
    await contentSession.cookies.remove(`https://${domain}${cookie.path}`, cookie.name)
  }

  await contentSession.cookies.flushStore()
}

// Quit when all windows are closed, except on macOS. There, it"s common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', async () => {
  await clearLoginCookies()

  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
