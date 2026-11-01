import { useEffect, useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Titlebar } from './components/Titlebar'
import { Content } from './components/Content'
import { InfoCard } from './components/InfoCard'

function App() {
  const [currentUrl, setCurrentUrl] = useState('https://www.bungie.net/7/en/News/Destiny')
  const [sidebarIsOpen, setSidebarIsOpen] = useState(true)
  const [infoCard, setInfoCard] = useState(null)

  const showInfoCard = (card) => {
    console.log('Sending info card.')
    setInfoCard({
      title: card.title,
      description: card.description,
      image: card.image || '/images/popup.png',
      hueRotate: card.hueRotate ?? 0,
      ingoreOneTime: card.ingoreOneTime ?? false
    })
    console.log('Sent info card.')
  }

  useEffect(() => {
    window.api.sendInfoCard((card) => {
      showInfoCard(card)
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
