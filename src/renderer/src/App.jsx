import { useEffect, useState } from 'react'
import { version } from '../../../package.json'

import { Sidebar } from './components/Sidebar'
import { Titlebar } from './components/Titlebar'
import { Content } from './components/Content'
import { InfoCard } from './components/InfoCard'

const welcomeCard = {
  title: 'WELCOME',
  description:
    'Welcome to MIDA - The Destiny 2 Multi-Tool!\n\nPress F2 to toggle the in-game overlay. Press CTRL+S to toggle the sidebar (or use the button in the top of the screen). And finally right click on apps to pin them.\n\nTalking about the buttons at the top of the screen, if you need support click the Discord button and if you really enjoy MIDA, please consider donating!',
  hueRotate: 60
}

const updateCard = {
  title: 'NOT USED',
  description: 'NOT YET USED WILL BE USED IN NEXT UPDATE',
  hueRotate: 0
}

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
    window.api.getUserData().then((userData) => {
      if (userData.flags.firstTimeLaunch) {
        console.log('Sending update card.')
        setInfoCard(welcomeCard)
        console.log('Sent welcome card.')
      } else if (userData.currentVersion !== version) {
        console.log('Sending update card.')
        setInfoCard(updateCard)
        console.log('Sent update card.')
      }
    })

    window.api.saveUserData(['currentVersion'], version)
    console.log('Updated current version.')

    window.api.closeInfoCard(() => {
      console.log('Closing info card.')
      setInfoCard(null)
      window.api.saveUserData(['flags', 'firstTimeLaunch'], false)
      console.log('Closed info card.')
    })
  }, [])

  return (
    <main className={`main-grid w-screen h-screen ${sidebarIsOpen ? '' : 'closed'}`}>
      {infoCard ? (
        <InfoCard
          {...infoCard}
          onClose={() => {
            setInfoCard(null)
            window.api.saveUserData(['flags', 'firstTimeLaunch'], false)
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
