const { autoUpdater } = require("electron-updater");
const { showToast } = require("./toast");

function checkForUpdate(win) {
  autoUpdater.once("update-downloaded", ({ version }) => {
    showToast(
      win,
      `Update v${version} downloaded. Please restart MIDA to install.`,
    );
  });
  autoUpdater.checkForUpdates().catch((err) => {
    console.log(err.message);
  });
}

module.exports = { checkForUpdate };
