export function TabButton({ image, text, onClick, forceSquare }) {
  return (
    <div
      className="relative w-60 h-20 border border-destiny-backup-text/50 flex flex-row items-center pl-2 bg-gradient-to-l from-destiny-backup-text/55 transition-colors duration-200 hover:from-destiny-backup-text/80 to-transparent active:to-destiny-backup-text/20 active:from-destiny-backup-text/90 cursor-pointer"
      onClick={onClick}
    >
      {image ? (
        <img
          src={image}
          alt=""
          className={`w-15 h-15 object-contain shrink-0 ${forceSquare ? '' : 'rounded-full'}`}
        />
      ) : (
        <img src={'/images/icon.png'} alt="" className="w-15 h-15" />
      )}
      <span className="pl-4 text-md font-bold text-destiny-main-text">{text}</span>

      <div className="absolute -left-px -top-px border-t border-l border-destiny-main-text/25 w-3 h-3"></div>
      <div className="absolute -right-px -top-px border-t border-r border-destiny-main-text/25 w-3 h-3"></div>
      <div className="absolute -left-px -bottom-px border-b border-l border-destiny-main-text/25 w-3 h-3"></div>
      <div className="absolute -right-px -bottom-px border-b border-r border-destiny-main-text/25 w-3 h-3"></div>
    </div>
  )
}

export function TabSlot() {
  return (
    <div className="relative w-60 h-20 flex items-center justify-center">
      <div className="absolute -left-px -top-px border-t border-l border-destiny-backup-text/50 w-3 h-3"></div>
      <div className="absolute -right-px -top-px border-t border-r border-destiny-backup-text/50 w-3 h-3"></div>
      <div className="absolute -left-px -bottom-px border-b border-l border-destiny-backup-text/50 w-3 h-3"></div>
      <div className="absolute -right-px -bottom-px border-b border-r border-destiny-backup-text/50 w-3 h-3"></div>
    </div>
  )
}

export function TabSeperator({ text }) {
  return (
    <div className="relative w-60 pt-4 pb-1 flex items-center">
      <div className="flex flex-col w-full">
        <span className="text-destiny-backup-text text-lg">{text}</span>
        <div className="border-b-2 border-destiny-backup-text flex-1"></div>
      </div>
    </div>
  )
}
