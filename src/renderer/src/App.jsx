import { useState } from 'react'

import { Sidebar } from './components/Sidebar'
import { Titlebar } from './components/Titlebar'
import { Content } from './components/Content'

function App() {
  const [currentUrl, setCurrentUrl] = useState('https://www.bungie.net/7/en/News/Destiny')
  return (
    <main className="main-grid w-screen h-screen">
      <div className="titlebar">
        <Titlebar setCurrentUrl={setCurrentUrl} />
      </div>
      <div className="sidebar">
        <Sidebar setCurrentUrl={setCurrentUrl} />
      </div>
      <div className="content">
        <Content url={currentUrl} />
      </div>
    </main>
  )
}

export default App
