import { app } from 'electron'
import { join } from 'path'
import { readFile, writeFile } from 'fs/promises'
import semver from 'semver'

const sitesFile = () => join(app.getPath('userData'), 'sites.json')

const defaultSites = {
  version: app.getVersion(),
  'bungie.net': [
    {
      id: crypto.randomUUID(),
      text: 'Destiny News',
      url: 'https://www.bungie.net/7/en/News/Destiny',
      image: 'images/destinynews.png'
    },
    {
      id: crypto.randomUUID(),
      text: 'Fireteam Finder',
      url: 'https://www.bungie.net/7/en/FireteamFinder',
      image: 'images/fireteamfinder.png',
      forceSquare: true
    }
  ],
  tools: [
    {
      id: crypto.randomUUID(),
      text: 'DIM',
      url: 'https://app.destinyitemmanager.com',
      image: 'images/dim.png'
    },
    {
      id: crypto.randomUUID(),
      text: 'light.gg',
      url: 'https://www.light.gg/',
      image: 'images/lightgg.png'
    },
    {
      id: crypto.randomUUID(),
      text: 'Braytech',
      url: 'https://bray.tech/',
      image: 'images/braytech.png'
    },
    {
      id: crypto.randomUUID(),
      text: 'Destiny Report',
      url: 'https://destiny.report/',
      image: 'images/destinyreport.png'
    },
    {
      id: crypto.randomUUID(),
      text: 'Godroll.tv',
      url: 'https://godroll.tv/',
      image: 'images/godrolltv.png'
    },
    {
      id: crypto.randomUUID(),
      text: 'D2ArmorPicker',
      url: 'https://d2armorpicker.com',
      image: 'images/d2armorpicker.png'
    },
    {
      id: crypto.randomUUID(),
      text: 'D2 Reference List',
      url: 'https://d2referencelist.org/',
      image: 'images/d2referencelist.png'
    }
  ],
  'guides and builds': [
    {
      id: crypto.randomUUID(),
      text: 'blueberries.gg',
      url: 'https://www.blueberries.gg/',
      image: 'images/blueberries.png',
      forceSquare: true
    },
    {
      id: crypto.randomUUID(),
      text: 'Mobalytics',
      url: 'https://mobalytics.gg/destiny-2',
      image: 'images/mobalytics.png'
    },
    {
      id: crypto.randomUUID(),
      text: 'D2 Build Buddy',
      url: 'https://d2buildbuddy.com/',
      image: 'images/d2buildbuddy.png'
    }
  ],
  'player lookup': [
    {
      id: crypto.randomUUID(),
      text: 'Destiny Tracker',
      url: 'https://destinytracker.com/',
      image: 'images/trackernetwork.jpg'
    },
    {
      id: crypto.randomUUID(),
      text: 'Guardian Report',
      url: 'https://guardian.report/',
      image: 'images/vladmarkreport.png'
    },
    {
      id: crypto.randomUUID(),
      text: 'Crucible Report',
      url: 'https://crucible.report/',
      image: 'images/vladmarkreport.png'
    },
    {
      id: crypto.randomUUID(),
      text: 'Trials Report',
      url: 'https://trials.report/',
      image: 'images/vladmarkreport.png'
    },
    {
      id: crypto.randomUUID(),
      text: 'Raid Report',
      url: 'https://raid.report/',
      image: 'images/raidreport.png'
    },
    {
      id: crypto.randomUUID(),
      text: 'Dungeon Report',
      url: 'https://dungeon.report/',
      image: 'images/dungeonreport.png'
    },
    {
      id: crypto.randomUUID(),
      text: 'Wasted on Destiny',
      url: 'https://wastedondestiny.com/',
      image: 'images/wastedondestiny.png',
      forceSquare: true
    }
  ],
  spreadsheets: [
    {
      id: crypto.randomUUID(),
      text: 'Destiny Data Compendium',
      url: 'https://docs.google.com/spreadsheets/d/1WaxvbLx7UoSZaBqdFr1u32F2uWVLo-CJunJB4nlGUE4',
      image: 'images/datacompendium.png',
      forceSquare: true
    },
    {
      id: crypto.randomUUID(),
      text: 'Aegis Damage Spreadsheet',
      url: 'https://docs.google.com/spreadsheets/d/1_5wtBjRYHHxuF4oJKDb_iOGZs-wTkzB6RYbnyNLbuz4',
      image: 'images/aegis.png'
    },
    {
      id: crypto.randomUUID(),
      text: "Court's Damage Buffs/Debuffs",
      url: 'https://docs.google.com/spreadsheets/d/1i1KUwgVkd8qhwYj481gkV9sZNJQCE-C3Q-dpQutPCi4',
      image: 'images/court.png'
    },
    {
      id: crypto.randomUUID(),
      text: "SaxPlaysGames' Loot Sources",
      url: 'https://docs.google.com/spreadsheets/d/1WDj-vExf9c982PVc1nRRfjadhkcZFqa7nv14cCMI8C8',
      image: 'images/sax.png'
    },
    {
      id: crypto.randomUUID(),
      text: "Squid's Destiny 2 Cosmetics",
      url: 'https://docs.google.com/spreadsheets/d/1IzXFe_QyYs1SNh07ahm_nklql5V9W0blkFA7SeN4kTs',
      image: 'images/squid.jpg'
    }
  ],
  misc: [
    {
      id: crypto.randomUUID(),
      text: 'Ishtar Collective',
      url: 'https://www.ishtar-collective.net/',
      image: 'images/ishtar.png'
    },
    {
      id: crypto.randomUUID(),
      text: 'Destiny Recipes',
      url: 'https://destinyrecipes.com/',
      image: 'images/destinyrecipes.png'
    },
    {
      id: crypto.randomUUID(),
      text: 'engram.blue',
      url: 'https://engram.blue/',
      image: 'images/engramblue.png'
    },
    {
      id: crypto.randomUUID(),
      text: 'Destiny Emblem Collector',
      url: 'https://destinyemblemcollector.com/',
      image: 'images/destinyemblemcollector.png'
    },
    {
      id: crypto.randomUUID(),
      text: 'D2Checkpoint',
      url: 'https://d2checkpoint.com/',
      image: 'images/d2checkpoint.png'
    }
  ]
}

function compareVersion(x, y) {
  return semver.lt(semver.coerce(x), semver.coerce(y))
}

export async function fetchSites() {
  try {
    const sites = await readFile(sitesFile(), 'utf8')
    const parsedJson = JSON.parse(sites)

    if (compareVersion(parsedJson.version, app.getVersion())) {
      await writeFile(sitesFile(), JSON.stringify(defaultSites, null, 2))
      return defaultSites
    }

    return parsedJson
  } catch {
    await writeFile(sitesFile(), JSON.stringify(defaultSites, null, 2))
    return defaultSites
  }
}
