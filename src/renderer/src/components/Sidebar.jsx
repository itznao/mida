import { useEffect, useState } from 'react'
import { TabButton, TabSlot, TabSeperator } from './Tabs'

export function Sidebar({ setCurrentUrl }) {
  const [sites, setSites] = useState({})

  useEffect(() => {
    window.api.getSites().then(setSites)
  }, [])

  const list = []

  for (let category in sites) {
    list.push(<TabSeperator key={category} text={category.toUpperCase()} />)

    for (let i in sites[category]) {
      const site = sites[category][i]
      if (site.text && site.image && site.url) {
        list.push(
          <TabButton
            key={site.id}
            image={site.image}
            text={site.text}
            url={site.url}
            forceSquare={site.forceSquare}
            onClick={() => setCurrentUrl(site.url)}
          />
        )
      } else {
        list.push(<TabSlot key={site.id} />)
      }
    }
  }

  return (
    <div className="relative w-full h-full bg-black/20 grid justify-items-center gap-2 pt-2 pb-8 overflow-y-auto">
      {list}
    </div>
  )
}
