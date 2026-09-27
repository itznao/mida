const SHORTCUTS = [
  {
    keys: ["Escape"],
    run: (contents) =>
      contents.navigationHistory.canGoBack() &&
      contents.navigationHistory.goBack(),
  },
  {
    keys: ["F5", "Ctrl+R"],
    run: (contents) => contents.reload(),
  },
  {
    keys: ["Shift+F5", "Ctrl+Shift+R"],
    run: (contents) => contents.reloadIgnoringCache(),
  },
  {
    keys: ["Ctrl+=", "Ctrl++", "Ctrl+Shift+=", "Ctrl+Shift++"],
    run: (contents) => contents.setZoomLevel(contents.getZoomLevel() + 0.5),
  },
  {
    keys: ["Ctrl+-", "Ctrl+_", "Ctrl+Shift+-", "Ctrl+Shift+_"],
    run: (contents) => contents.setZoomLevel(contents.getZoomLevel() - 0.5),
  },
  {
    keys: ["Ctrl+0", "Ctrl+Shift+0"],
    run: (contents) => contents.setZoomLevel(0),
  },
];

const comboOf = (input) =>
  [
    input.control && "Ctrl",
    input.shift && "Shift",
    input.alt && "Alt",
    input.meta && "Meta",
    input.key.length === 1 ? input.key.toUpperCase() : input.key,
  ]
    .filter(Boolean)
    .join("+");

function handleShortcut(contents, event, input) {
  if (!contents || input.type !== "keyDown") return;
  const shortcut = SHORTCUTS.find(({ keys }) => keys.includes(comboOf(input)));
  if (!shortcut) return;

  event.preventDefault();
  shortcut.run(contents);
}

module.exports = { handleShortcut };
