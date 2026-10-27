import { useEffect, useState } from 'react'
import { TabButton, TabSlot, TabSeperator } from './SidebarItems'

export function Sidebar({ setCurrentUrl, sidebarIsOpen }) {
  const [apps, setApps] = useState([])

  useEffect(() => {
    console.log('Fetching apps.')
    window.api.getApps().then(setApps)
    console.log('Fetched apps:\n' + apps)
  }, [])

  const totalApps = apps.flatMap((category) => category.apps).length
  const list = []
  const pinned = []

  for (const category of apps) {
    list.push(
      <TabSeperator
        key={category.id}
        text={category.text.toUpperCase()}
        length={category.apps.filter((app) => !app.pinned).length}
        maxLength={totalApps}
      />
    )

    for (const app of category.apps) {
      if (app.text && app.image && app.url) {
        ;(app.pinned ? pinned : list).push(
          <TabButton
            key={app.id}
            image={app.image}
            text={app.text}
            url={app.url}
            forceSquare={app.forceSquare}
            pinned={app.pinned}
            onClick={() => setCurrentUrl(app.url)}
            onContextMenu={async (e) => {
              e.preventDefault()

              await window.api.togglePin(app.id)
              setApps(await window.api.getApps())
            }}
          />
        )
      } else {
        list.push(<TabSlot key={app.id} />)
      }
    }
  }

  return (
    <div
      id="sidebar"
      className={`relative w-full h-full bg-black/20 grid justify-items-center gap-2 pt-2 pb-8 overflow-y-auto select-none transition-transform duration-300 ${sidebarIsOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {pinned.length > 0 && (
        <TabSeperator text="PINNED" length={pinned.length} maxLength={totalApps} />
      )}
      {pinned}
      {list}
    </div>
  )
}
