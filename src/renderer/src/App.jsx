import { useState } from "react"
import semver from "semver"

import { Sidebar } from "./components/Sidebar"
import { Titlebar } from "./components/Titlebar"
import { Content } from "./components/Content"
import { InfoCard } from './components/InfoCard'

function App() {
  const appVersion = "2.1.1";

  const [currentUrl, setCurrentUrl] = useState(
    "https://www.bungie.net/7/en/News/Destiny"
  );

  const [sidebarIsOpen, setSidebarIsOpen] = useState(true);

  const showInfoCard = (title, description, hueRotate = 0) => {
    setInfoCard({ title, description, hueRotate });
  };

  const [infoCard, setInfoCard] = useState(() => {
    const previousVersion = semver.coerce(localStorage.getItem("previousVersion"));

    if (
      localStorage.getItem("hideWelcomeMessage") !== true) {
      localStorage.setItem("hideWelcomeMessage", true);
      localStorage.setItem("previousVersion", appVersion);

      return {
        title: "WELCOME",
        description:
          "Welcome to MIDA - The Destiny 2 Multi-Tool!\n\nPress F2 to toggle the in-game overlay. Press CTRL+S to toggle the sidebar (or use the button in the top of the screen). And finally right click on apps to pin them.\n\nTalking about the buttons at the top of the screen, if you need support click the Discord button and if you really enjoy MIDA, please consider donating!",
        hueRotate: 60
      };
    }

    if (
      previousVersion &&
      semver.coerce(appVersion) &&
      semver.lt(previousVersion.version, semver.coerce(appVersion).version)
    ) {
      localStorage.setItem("previousVersion", appVersion);

      return;
      return {
        title: "NOT USED",
        description: "NOT YET USED WILL BE USED IN NEXT UPDATE",
        hueRotate: 0
      };""
    }

    localStorage.setItem("previousVersion", appVersion);
    return null;
  });

  window.api.closeInfoCard(() => {
    localStorage.setItem("hideWelcomeMessage", true);
    setInfoCard(null);
  })

  return (
    <main className={`main-grid w-screen h-screen ${sidebarIsOpen ? "" : "closed"}`}>
      {infoCard ? (
        <InfoCard
          {...infoCard}
          onClose={() => {
            setInfoCard(null);
          }}
        />
      ) : ""}
      <Titlebar setCurrentUrl={setCurrentUrl} setSidebarIsOpen={setSidebarIsOpen} sidebarIsOpen={sidebarIsOpen} />
      <Sidebar setCurrentUrl={setCurrentUrl} sidebarIsOpen={sidebarIsOpen} />
      <Content url={currentUrl} />
    </main>
  )
}

export default App