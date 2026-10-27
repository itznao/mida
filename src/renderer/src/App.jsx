import { useEffect, useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Titlebar } from './components/Titlebar'
import { Content } from './components/Content'
import { InfoCard } from './components/InfoCard'

function App() {
  const [currentUrl, setCurrentUrl] = useState('https://www.bungie.net/7/en/News/Destiny')
  const [sidebarIsOpen, setSidebarIsOpen] = useState(true)
  const [infoCard, setInfoCard] = useState(null)

  const showInfoCard = (title, description, hueRotate = 0) => {
    console.log('Sending info card.')
    setInfoCard({ title, description, hueRotate })
    console.log('Sent info card.')
  }

  useEffect(() => {
    window.api.sendInfoCard((card) => {
      showInfoCard(card.title, card.description, card.hueRotate)
    })

    window.api.closeInfoCard(() => {
      setInfoCard(null)
    })

    window.api.toggleSidebarHotkey(() => setSidebarIsOpen((open) => !open))

    window.api.appReady()
  }, [])

  return (
    <main className={`main-grid w-screen h-screen ${sidebarIsOpen ? '' : 'closed'}`}>
      {infoCard ? (
        <InfoCard
          {...infoCard}
          onClose={() => {
            setInfoCard(null)
          }}
        />
      ) : (
        ''
      )}
      <Titlebar
        setCurrentUrl={setCurrentUrl}
        setSidebarIsOpen={setSidebarIsOpen}
        sidebarIsOpen={sidebarIsOpen}
      />
      <Sidebar setCurrentUrl={setCurrentUrl} sidebarIsOpen={sidebarIsOpen} />
      <Content url={currentUrl} />
    </main>
  )
}

export default App
