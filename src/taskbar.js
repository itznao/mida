const { app } = require("electron");

const SW_HIDE = 0;
const SW_SHOWNA = 8;

let user32 = null;
try {
  const koffi = require("koffi");
  const lib = koffi.load("user32.dll");
  user32 = {
    FindWindowW: lib.func("void* __stdcall FindWindowW(str16 cls, str16 name)"),
    FindWindowExW: lib.func(
      "void* __stdcall FindWindowExW(void* parent, void* after, str16 cls, str16 name)",
    ),
    ShowWindow: lib.func("bool __stdcall ShowWindow(void* hwnd, int cmd)"),
  };
} catch (err) {
  console.log("[taskbar] not available:", err.message);
}

function findTaskbars() {
  const taskbars = [user32.FindWindowW("Shell_TrayWnd", null)];
  let next = null;
  while (
    (next = user32.FindWindowExW(null, next, "Shell_SecondaryTrayWnd", null))
  )
    taskbars.push(next);
  return taskbars.filter(Boolean);
}

function setTaskbar(visible) {
  if (!user32) return;
  for (const taskbar of findTaskbars())
    user32.ShowWindow(taskbar, visible ? SW_SHOWNA : SW_HIDE);
}

function restoreTaskbarOnExit() {
  const restore = () => setTaskbar(true);
  restore();
  app.on("will-quit", restore);
  process.on("exit", restore);
  process.on("uncaughtException", (err) => {
    restore();
    console.error(err);
    app.exit(1);
  });
}

module.exports = { setTaskbar, restoreTaskbarOnExit };
