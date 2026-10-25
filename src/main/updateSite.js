import { app } from "electron"
import { join } from "path"
import { readFile, writeFile } from "fs/promises"

const sitesFile = () => join(app.getPath("userData"), "sites.json")

export async function updateSite(id, changes) {
  const { version, ...sites } = JSON.parse(await readFile(sitesFile(), "utf8"))

  for (const category in sites) {
    const site = sites[category].find(x => x.id === id)

    if (site) {
      Object.assign(site, changes)

      await writeFile(sitesFile(), JSON.stringify({ version, ...sites }, null, 2), "utf8")

      return sites
    }
  }
}
