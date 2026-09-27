const { VERSION, GITHUB_REPO } = require("./config");
const { showToast } = require("./toast");

const versionParts = (version) =>
  version
    .replace(/^v/i, "")
    .split(".")
    .map((part) => parseInt(part, 10) || 0);

function isNewer(latest, current) {
  const a = versionParts(latest);
  const b = versionParts(current);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const difference = (a[i] || 0) - (b[i] || 0);
    if (difference) return difference > 0;
  }
  return false;
}

async function checkForUpdate(win) {
  if (!GITHUB_REPO) return;
  try {
    const response = await fetch(
      `${GITHUB_REPO.replace("https://github.com/", "https://api.github.com/repos/")}/releases/latest`,
    );
    if (!response.ok) return;
    const { tag_name: latest } = await response.json();
    if (latest && isNewer(latest, VERSION)) {
      showToast(
        win,
        `MIDA ${latest} is out.`,
        `${GITHUB_REPO}/releases/latest`,
      );
    }
  } catch (err) {
    console.log("[update] check failed:", err.message);
  }
}

module.exports = { checkForUpdate };
