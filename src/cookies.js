const { session } = require("electron");
const { PARTITION, KEEP_LOGIN_DAYS } = require("./config");

const LOGIN_COOKIE = "bungleatk";
const DAY = 24 * 60 * 60;
const KEEP_FOR = KEEP_LOGIN_DAYS * DAY;
const SIGN_IN_PROVIDERS = [
  "steamcommunity.com",
  "steampowered.com",
  "live.com",
  "microsoftonline.com",
  "xbox.com",
  "playstation.com",
  "sonyentertainmentnetwork.com",
  "epicgames.com",
  "twitch.tv",
];

const cookies = () => session.fromPartition(PARTITION).cookies;
const hostOf = (cookie) => cookie.domain.replace(/^\./, "");
const urlOf = (cookie) => `https://${hostOf(cookie)}${cookie.path}`;
const isOn = (cookie, site) =>
  hostOf(cookie) === site || hostOf(cookie).endsWith(`.${site}`);
const isBungie = (cookie) => isOn(cookie, "bungie.net");
const isProvider = (cookie) =>
  SIGN_IN_PROVIDERS.some((site) => isOn(cookie, site));
const expiresSoon = (cookie) =>
  !cookie.expirationDate ||
  cookie.expirationDate < Date.now() / 1000 + KEEP_FOR - DAY;

async function isLoggedIn() {
  return (await cookies().get({ name: LOGIN_COOKIE })).some(isBungie);
}

function keepBungieCookie(cookie) {
  cookies()
    .set({
      url: urlOf(cookie),
      name: cookie.name,
      value: cookie.value,
      domain: cookie.hostOnly ? undefined : cookie.domain,
      path: cookie.path,
      secure: cookie.secure,
      httpOnly: cookie.httpOnly,
      sameSite: cookie.sameSite,
      expirationDate: Date.now() / 1000 + KEEP_FOR,
    })
    .catch((err) =>
      console.log("[cookie] save failed:", cookie.name, err.message),
    );
}

async function keepBungieLogin() {
  const bungieCookies = await cookies().get({ domain: "bungie.net" });
  bungieCookies.filter(expiresSoon).forEach(keepBungieCookie);
}

async function forgetProviders() {
  for (const cookie of (await cookies().get({})).filter(isProvider)) {
    await cookies()
      .remove(urlOf(cookie), cookie.name)
      .catch(() => {});
  }
}

function watchBungieCookies(onLoginCookieChange) {
  cookies().on("changed", (_event, cookie, _cause, removed) => {
    if (!isBungie(cookie)) return;
    if (cookie.name === LOGIN_COOKIE) onLoginCookieChange();
    if (!removed && expiresSoon(cookie)) keepBungieCookie(cookie);
  });
}

module.exports = {
  isLoggedIn,
  keepBungieLogin,
  forgetProviders,
  watchBungieCookies,
};
