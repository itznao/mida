const { ipcMain } = require("electron");
const {
  GROUPS,
  TOOLS,
  SIGN_IN_URL,
  SIDEBAR_WIDTH,
  TITLEBAR_HEIGHT,
  UNLOAD_HIDDEN_AFTER,
} = require("./config");
const { createView } = require("./view");
const { handleShortcut } = require("./shortcuts");

const homeUrls = {
  ...Object.fromEntries(TOOLS.map((tool) => [tool.id, tool.url])),
  signin: SIGN_IN_URL,
};

function createTabs(win) {
  const views = {};
  let lastUrls = {};
  const unloadTimers = {};
  let active = null;
  let left = SIDEBAR_WIDTH;

  const layout = () => {
    const [width, height] = win.getContentSize();
    for (const [id, view] of Object.entries(views))
      view.setVisible(id === active);

    views[active]?.setBounds({
      x: left,
      y: TITLEBAR_HEIGHT,
      width: width - left,
      height: height - TITLEBAR_HEIGHT,
    });
  };

  const forgetTab = (id, view) => {
    if (views[id] !== view) return;

    clearTimeout(unloadTimers[id]);
    delete views[id];

    if (!win.isDestroyed()) win.contentView.removeChildView(view);
    if (id === active) setImmediate(() => !win.isDestroyed() && show(id));
  };

  const open = (id, url) => {
    if (views[id]) {
      if (url) views[id].webContents.loadURL(url).catch(() => {});
      return views[id];
    }

    const view = createView(url || lastUrls[id] || homeUrls[id]);
    delete lastUrls[id];
    views[id] = view;
    win.contentView.addChildView(view, 0);
    view.webContents.once("destroyed", () => forgetTab(id, view));
    return view;
  };

  const unload = (id) => {
    const view = views[id];
    if (!view || id === active) return;
    if (view.webContents.isCurrentlyAudible()) return scheduleUnload(id);

    lastUrls[id] = view.webContents.getURL();
    delete views[id];
    win.contentView.removeChildView(view);
    view.webContents.close();
  };

  const scheduleUnload = (id) => {
    clearTimeout(unloadTimers[id]);
    unloadTimers[id] = setTimeout(() => unload(id), UNLOAD_HIDDEN_AFTER);
  };

  const show = (id, url) => {
    if (!homeUrls[id]) return;
    if (active && id !== active) scheduleUnload(active);
    clearTimeout(unloadTimers[id]);

    active = id;
    const view = open(id, url);
    layout();
    win.webContents.send("active-tab", id);
    if (left === 0) view.webContents.focus();
  };

  const blankAll = () =>
    Promise.all(
      Object.values(views).map((view) =>
        Promise.race([
          view.webContents.loadURL("about:blank").catch(() => {}),
          new Promise((resolve) => setTimeout(resolve, 2000)),
        ]),
      ),
    );

  const reloadAll = () => {
    lastUrls = {};

    for (const [id, view] of Object.entries(views)) {
      view.webContents
        .loadURL(homeUrls[id])
        .catch(() => {})
        .finally(() => view.webContents?.navigationHistory.clear());
    }
  };

  win.on("resize", layout);
  win.on("minimize", () => Object.keys(views).forEach(unload));
  win.webContents.on("before-input-event", (event, input) =>
    handleShortcut(views[active]?.webContents, event, input),
  );

  ipcMain.handle("tools", () =>
    GROUPS.map((group) => ({
      name: group.name,
      tools: group.tools.map(({ id, name }) => ({ id, name })),
    })),
  );
  ipcMain.on("show", (_event, id) => show(id));
  ipcMain.handle("active-tab", () => active);

  return {
    show,
    blankAll,
    reloadAll,
    current: () => views[active],
    left: () => left,
    setLeft: (x) => {
      left = x;
      layout();
    },
  };
}

module.exports = { createTabs };
