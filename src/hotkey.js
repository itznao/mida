const { app, globalShortcut } = require("electron");
const { HOTKEY, ANIMATION_MS } = require("./config");
const { setTaskbar, restoreTaskbarOnExit } = require("./taskbar");
const { animate } = require("./animate");

function setupHotkey(win) {
  let stopFade = () => {};
  let leaving = false;

  const fade = (to, onDone) => {
    const from = win.getOpacity();
    stopFade();
    stopFade = animate(
      win,
      ANIMATION_MS,
      (progress) => {
        win.setOpacity(from + (to - from) * progress);
      },
      onDone,
    );
  };

  const bringToFront = () => {
    leaving = false;
    if (win.isMinimized() || !win.isFocused()) win.setOpacity(0);
    if (win.isMinimized()) win.restore();
    win.show();
    win.focus();
    setTaskbar(false);
    fade(1);
  };

  const sendToBack = () => {
    leaving = true;
    fade(0, () => {
      win.minimize();
      win.setOpacity(1);
      leaving = false;
      setTaskbar(true);
    });
  };

  const toggle = () => {
    const inFront = win.isVisible() && !win.isMinimized() && win.isFocused();
    if (inFront && !leaving) sendToBack();
    else bringToFront();
  };

  restoreTaskbarOnExit();
  win.on("blur", () => setTaskbar(true));

  if (!globalShortcut.register(HOTKEY, toggle)) {
    console.log(`[hotkey] ${HOTKEY} is already taken by another app`);
  }
  app.on("will-quit", () => globalShortcut.unregisterAll());
}

module.exports = { setupHotkey };
