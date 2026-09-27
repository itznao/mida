const { WebContentsView } = require('electron');
const { PARTITION, MAIN_BG } = require('./config');
const { handleShortcut } = require('./shortcuts');

function createView(url) {
  const view = new WebContentsView({
    webPreferences: { partition: PARTITION, spellcheck: false },
  });
  view.setBackgroundColor(MAIN_BG);
  const contents = view.webContents;

  contents.setWindowOpenHandler(({ url: target }) => {
    if (/^https?:/.test(target)) contents.loadURL(target).catch(() => {});
    return { action: 'deny' };
  });
  contents.on('will-prevent-unload', (event) => event.preventDefault());

  let fullscreen = false;
  contents.on('enter-html-full-screen', () => (fullscreen = true));
  contents.on('leave-html-full-screen', () => (fullscreen = false));
  contents.on('before-input-event', (event, input) => {
    if (!fullscreen) handleShortcut(contents, event, input);
  });

  contents.loadURL(url);
  return view;
}

module.exports = { createView };
