const path = require("path");
const { app, nativeTheme } = require("electron");
const { TOOLS } = require("./src/config");
const { createWindow } = require("./src/window");
const { createTabs } = require("./src/tabs");
const { setupMenu } = require("./src/menu");
const { setupAccount } = require("./src/account");
const { setupHotkey } = require("./src/hotkey");
const { checkForUpdate } = require("./src/updates");

app.setPath("userData", path.join(process.env.LOCALAPPDATA, "MIDA"));
if (!app.requestSingleInstanceLock()) app.exit();

app.disableHardwareAcceleration();

app.whenReady().then(() => {
  app.setAppUserModelId("com.itznao.mida");
  nativeTheme.themeSource = "dark";

  const win = createWindow();
  const tabs = createTabs(win);

  setupMenu(win, tabs);
  setupAccount(win, tabs);
  setupHotkey(win);
  tabs.show(TOOLS[0].id);
  win.webContents.once("did-finish-load", () => checkForUpdate(win));

  app.on("second-instance", () => {
    if (win.isMinimized()) win.restore();
    win.show();
    win.focus();
  });
});

app.on("window-all-closed", () => app.quit());
