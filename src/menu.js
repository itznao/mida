const { ipcMain } = require("electron");
const { SIDEBAR_WIDTH, ANIMATION_MS } = require("./config");
const { animate, easeOut } = require("./animate");

function setupMenu(win, tabs) {
  let open = true;
  let stopSlide = () => {};

  const toggle = () => {
    open = !open;
    win.webContents.send("menu", open);

    const from = tabs.left();
    const to = open ? SIDEBAR_WIDTH : 0;
    stopSlide();
    stopSlide = animate(win, ANIMATION_MS, (progress) => {
      tabs.setLeft(Math.round(from + (to - from) * easeOut(progress)));
    });

    if (open) win.webContents.focus();
    else tabs.current()?.webContents.focus();
  };

  ipcMain.on("toggle-menu", toggle);
}

module.exports = { setupMenu };
