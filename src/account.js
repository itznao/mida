const { app, ipcMain, session } = require("electron");
const { PARTITION, SIGN_IN_URL } = require("./config");
const { showToast } = require("./toast");
const {
  isLoggedIn,
  keepBungieLogin,
  forgetProviders,
  watchBungieCookies,
} = require("./cookies");

function setupAccount(win, tabs) {
  const ses = session.fromPartition(PARTITION);
  let wasLoggedIn = null;
  let checkTimer;

  const checkLogin = () => {
    clearTimeout(checkTimer);
    checkTimer = setTimeout(async () => {
      const loggedIn = await isLoggedIn();
      if (loggedIn && wasLoggedIn === false) {
        showToast(win, "Saved your Bungie.net account.");
        forgetProviders();
        tabs.show("d2home");
        tabs.current().webContents.reload();
      }
      wasLoggedIn = loggedIn;
      if (!win.isDestroyed()) win.webContents.send("auth", loggedIn);
    }, 200);
  };

  const logout = async () => {
    console.log("[logout] unloading sites");
    await tabs.blankAll();
    console.log("[logout] clearing site data");
    await ses.clearStorageData();
    console.log("[logout] clearing cache");
    await ses.clearCache();
    await ses.clearAuthCache();
    await ses.cookies.flushStore();

    console.log("[logout] reloading sites");
    tabs.reloadAll();
    showToast(win, "Removed your Bungie.net account.");
  };

  watchBungieCookies(checkLogin);
  keepBungieLogin();
  forgetProviders();
  checkLogin();

  ipcMain.handle("auth", isLoggedIn);
  ipcMain.on("login", () => tabs.show("signin", SIGN_IN_URL));
  ipcMain.on("logout", logout);

  app.on("before-quit", () => {
    forgetProviders();
    ses.cookies.flushStore();
  });
}

module.exports = { setupAccount };
