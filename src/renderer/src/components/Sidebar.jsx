import { useEffect, useState } from "react"
import { TabButton, TabSlot, TabSeperator } from "./SidebarItems"

export function Sidebar({ setCurrentUrl, sidebarIsOpen }) {
  const [sites, setSites] = useState({})

  useEffect(() => {
    window.api.getSites().then(setSites)
  }, [])

  const totalSites = Object.values(sites).flat().length
  const list = []
  const pinned = []

  for (const category in sites) {
    list.push(<TabSeperator key={category} text={category.toUpperCase()} length={sites[category].filter(s => !s.favourite).length} maxLength={totalSites} />)

    for (const i in sites[category]) {
      const site = sites[category][i]
      const targetCategory = site.favourite ? "pinned".toUpperCase() : category
      if (site.text && site.image && site.url) {
        (site.favourite ? pinned : list).push(
          <TabButton
            key={site.id}
            image={site.image}
            text={site.text}
            url={site.url}
            forceSquare={site.forceSquare}
            favourite={site.favourite}
            onClick={() => setCurrentUrl(site.url)}
            onContextMenu={async (e) => {
              e.preventDefault();

              const updatedSites = await window.api.updateSite(site.id, { favourite: !site.favourite });
              setSites(updatedSites);
            }}
          />
        )
      } else {
        list.push(<TabSlot key={site.id} />)
      }
    }
  }

  return (
    <div id="sidebar" className={`relative w-full h-full bg-black/20 grid justify-items-center gap-2 pt-2 pb-8 overflow-y-auto select-none transition-transform duration-300 ${sidebarIsOpen ? "translate-x-0" : "-translate-x-full"}`}>
      {pinned.length > 0 && <TabSeperator text="PINNED" length={pinned.length} maxLength={totalSites} />}
      {pinned}
      {list}
    </div>
  )
}
