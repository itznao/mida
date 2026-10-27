import { app, globalShortcut } from 'electron'
import koffi from 'koffi'

export function setupHotkeys(win) {
  toggleFocused(win)
  toggleSidebar(win)
  closeInfoCard(win)
}

function toggleFocused(win) {
  // this is genuinely magic idfk how this works but it does so yeah
  const user32 = koffi.load('user32.dll')
  const FindWindowW = user32.func('void* __stdcall FindWindowW(str16, str16)')
  const ShowWindow = user32.func('bool __stdcall ShowWindow(void*, int)')

  // 5 does something different than 8, but 5 almost works but doesnt work not sure why
  const setTaskbar = (show) => ShowWindow(FindWindowW('Shell_TrayWnd', null), show ? 8 : 0)

  win.on('blur', () => setTaskbar(true))
  app.on('will-quit', () => setTaskbar(true))

  globalShortcut.register('F2', () => {
    console.log('toggleFocused key detected.')
    if (win.isFocused()) return win.minimize()

    win.show()
    win.focus()

    setTaskbar(false)
  })
}

function toggleSidebar(win) {
  globalShortcut.register('CTRL+S', () => {
    console.log('ToggleSidebar key detected.')
    win.webContents.send('hotkey:toggleSidebar')
  })
}

function closeInfoCard(win) {
  globalShortcut.register('ESC', () => {
    console.log('closeInfoCard key detected.')
    win.webContents.send('hotkey:closeInfoCard')
  })
}
