const GROUPS = [
  {
    name: 'Bungie.net',
    tools: [
      { id: 'd2home', name: 'Destiny Home', url: 'https://www.bungie.net/7/en/Destiny' },
      { id: 'd2news', name: 'Destiny News', url: 'https://www.bungie.net/7/en/News/Destiny' },
      { id: 'd2ftf', name: 'Destiny Fireteam Finder', url: 'https://www.bungie.net/7/en/FireteamFinder' },
      { id: 'bungiefriends', name: 'Bungie Friends', url: 'https://www.bungie.net/7/en/User/Account/BungieFriends' }
    ],
  },
  {
    name: 'Tools',
    tools: [
      { id: 'dim', name: 'DIM', url: 'https://app.destinyitemmanager.com' },
      { id: 'light', name: 'light.gg', url: 'https://light.gg' },
      { id: 'braytech', name: 'Braytech', url: 'https://bray.tech/' },
      { id: 'armor', name: 'D2ArmorPicker', url: 'https://d2armorpicker.com' },
      { id: 'd2report', name: 'Destiny Report', url: 'https://destiny.report/' }
    ],
  },
  {
    name: 'Guides / Builds',
    tools: [
      { id: 'blueberries', name: 'blueberries.gg', url: 'https://www.blueberries.gg/' },
      { id: 'mobalytics', name: 'Mobalytics', url: 'https://mobalytics.gg/destiny-2' }
    ],
  },
  {
    name: 'Player Lookup',
    tools: [
      { id: 'tracker', name: 'Destiny Tracker', url: 'https://destinytracker.com/' },
      { id: 'guardian', name: 'Guardian Report', url: 'https://guardian.report/' },
      { id: 'raid', name: 'Raid Report', url: 'https://raid.report/' },
      { id: 'dungeon', name: 'Dungeon Report', url: 'https://dungeon.report/' },
      { id: 'trials', name: 'Trials Report', url: 'https://trials.report/' },
      { id: 'wasted', name: 'Wasted on Destiny', url: 'https://wastedondestiny.com/' }
    ],
  },
  {
    name: 'Spreadsheets',
    tools: [
      { id: 'compendium', name: 'Destiny Data Compendium', url: 'https://docs.google.com/spreadsheets/d/1WaxvbLx7UoSZaBqdFr1u32F2uWVLo-CJunJB4nlGUE4' },
      { id: 'aegis', name: 'Aegis Damage Spreadsheet', url: 'https://docs.google.com/spreadsheets/d/1_5wtBjRYHHxuF4oJKDb_iOGZs-wTkzB6RYbnyNLbuz4' },
      { id: 'buffs', name: 'Court\'s Damage Buffs/Debuffs', url: 'https://docs.google.com/spreadsheets/d/1i1KUwgVkd8qhwYj481gkV9sZNJQCE-C3Q-dpQutPCi4' },
      { id: 'cosmetics', name: 'Squid\'s Destiny 2 Cosmetics', url: 'https://docs.google.com/spreadsheets/d/1IzXFe_QyYs1SNh07ahm_nklql5V9W0blkFA7SeN4kTs'}
    ],
  },
  {
    name: 'Misc',
    tools: [
      { id: 'ishtar', name: 'Ishtar Collective', url: 'https://www.ishtar-collective.net/' },
      { id: 'recipes', name: 'Destiny Recipes', url: 'https://destinyrecipes.com/' },
      { id: 'engramblue', name: 'engram.blue', url: 'https://engram.blue/' },
      { id: 'emblem', name: 'Destiny Emblem Collector', url: 'https://destinyemblemcollector.com/' },
      { id: 'checkpoint', name: 'D2Checkpoint', url: 'https://d2checkpoint.com/' }
    ],
  },
];

module.exports = {
  VERSION: '1.0.2',
  GITHUB_REPO: 'https://github.com/itznao/mida',

  GROUPS,
  TOOLS: GROUPS.flatMap((group) => group.tools),

  SIGN_IN_URL: 'https://www.bungie.net/7/en/User/SignIn',
  PARTITION: 'persist:destiny',
  KEEP_LOGIN_DAYS: 30,

  HOTKEY: 'F2',
  UNLOAD_HIDDEN_AFTER: 30 * 1000,
  ANIMATION_MS: 200,
  TOAST_MS: 5000,

  MAIN_BG: '#12171c',

  SIDEBAR_WIDTH: 200,
  TITLEBAR_HEIGHT: 48,
};
