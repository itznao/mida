const path = require("path");
const { WebContentsView, shell } = require("electron");
const { TOAST_MS } = require("./config");

function showToast(win, message, link) {
  if (win.isDestroyed()) return;

  const toast = new WebContentsView({
    webPreferences: { preload: path.join(__dirname, "preload.js") },
  });
  toast.setBackgroundColor("#00000000");
  toast.setBounds({ x: 0, y: 0, width: 800, height: 400 });

  let size;
  const place = () => {
    const [width, height] = win.getContentSize();
    toast.setBounds({
      x: width - size.width,
      y: height - size.height,
      ...size,
    });
  };

  const remove = () => {
    if (!win.isDestroyed()) {
      win.off("resize", place);
      win.contentView.removeChildView(toast);
    }
    toast.webContents.close();
  };

  toast.webContents.ipc.once("toast-size", (_event, measured) => {
    if (win.isDestroyed()) return remove();
    size = measured;
    place();
    win.on("resize", place);
    win.contentView.addChildView(toast);
  });
  toast.webContents.ipc.once("close-toast", remove);
  toast.webContents.ipc.on(
    "open-link",
    () => link?.startsWith("https://github.com/") && shell.openExternal(link),
  );

  toast.webContents.loadFile(path.join(__dirname, "..", "web", "toast.html"), {
    query: { msg: message, ms: TOAST_MS, link: link ? "yes" : "" },
  });
}

module.exports = { showToast };
