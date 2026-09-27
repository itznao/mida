const menu = document.getElementById("menu");
const toolList = document.getElementById("tools");
const authButton = document.getElementById("auth");

mida
  .getVersion()
  .then(
    (version) =>
      (document.getElementById("version").textContent = `v${version}`),
  );

const addItem = (tag, text, className) => {
  const item = document.createElement(tag);
  item.className = className;
  item.textContent = text;
  toolList.appendChild(item);
  return item;
};

mida.getTools().then((groups) => {
  for (const group of groups) {
    if (group.name)
      addItem(
        "div",
        group.name,
        "mt-2 py-3 px-4 text-left text-accent-text text-shadow-lg select-none",
      );

    for (const tool of group.tools) {
      const button = addItem(
        "button",
        tool.name,
        "ml-2 py-3 px-4 text-left text-slate-300 text-shadow-lg hover:text-slate-400 hover:cursor-pointer",
      );
      button.dataset.id = tool.id;
      button.onclick = () => mida.show(tool.id);
    }
  }
  mida.getActiveTab().then(markActive);
});

const markActive = (id) => {
  for (const button of toolList.querySelectorAll("button")) {
    button.classList.toggle("active-tab", button.dataset.id === id);
  }
};
mida.onActiveTab(markActive);

const setLoggedIn = (loggedIn) => {
  authButton.textContent = loggedIn ? "Sign Out" : "Sign In";
  authButton.onclick = loggedIn ? mida.logout : mida.login;
};
mida.isLoggedIn().then(setLoggedIn);
mida.onAuth(setLoggedIn);

mida.onMenu((open) => menu.classList.toggle("hidden-menu", !open));
mida.onMaximized((maximized) =>
  document.getElementById("maximize").classList.toggle("maximized", maximized),
);
