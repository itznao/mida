export function Titlebar({ setCurrentUrl, setSidebarIsOpen, sidebarIsOpen }) {
  return (
    <div
      id="titlebar"
      className="relative w-full h-full flex flex-row items-center justify-between border-b-2 border-destiny-backup-text"
    >
      <div className="flex flex-row gap-1 pl-2 items-center">
        <img src={'images/icon.png'} alt="" className="w-6 h-6" />
        <h1 className="text-destiny-main-text tracking-widest leading-none pt-0.5">MIDA</h1>
      </div>
      <div className="ml-auto flex flex-row-reverse items-center justify-center">
        <button
          className="w-12 h-12 hover:bg-red-500/50 active:bg-red-500/75 transition-colors flex items-center justify-center hover:cursor-pointer"
          onClick={() => window.api.close()}
        >
          <img src={'images/cross.svg'} alt="x" className="w-4.5 h-4.5" />
        </button>
        <button
          className="w-12 h-12 hover:bg-black/15 active:bg-white/5 transition-colors flex items-center justify-center hover:cursor-pointer"
          onClick={() => window.api.maximize()}
        >
          <img src={'images/square.svg'} alt="□" className="w-3.5 h-3.5" />
        </button>
        <button
          className="w-12 h-12 hover:bg-black/15 active:bg-white/5 transition-colors flex items-center justify-center hover:cursor-pointer"
          onClick={() => window.api.minimize()}
        >
          <img src={'images/line.svg'} alt="-" className="w-4.5 h-4.5" />
        </button>
        <div className="text-destiny-backup-text pl-3 pr-1 font-medium">I</div>
        <button
          className="w-8 h-8 flex items-center justify-center hover:cursor-pointer"
          onClick={() => window.api.openExternal('https://discord.com/invite/7gSFp628Sm')}
        >
          <img src={'images/discord.svg'} alt="x" className="w-4.5 h-4.5" />
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center hover:cursor-pointer"
          onClick={() => window.api.openExternal('https://ko-fi.com/itznao')}
        >
          <img src={'images/heart.svg'} alt="x" className="w-4.5 h-4.5" />
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center hover:cursor-pointer"
          onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
        >
          <img
            src={sidebarIsOpen ? 'images/leftpanelclosed.svg' : 'images/leftpanelopen.svg'}
            alt="x"
            className="w-4.5 h-4.5 translate-x-0.5"
          />
        </button>
      </div>
    </div>
  )
}
