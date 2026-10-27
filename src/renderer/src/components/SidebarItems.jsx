export function TabButton({ image, text, onClick, onContextMenu, forceSquare, pinned, devHighlight }) {
  return (
    <div
      className={`relative w-60 h-20 border ${pinned ? 'border-[#ceae33]/50 from-[#ceae33]/55 to-transparent hover:from-[#ceae33]/80 active:to-[#ceae33]/20 active:from-[#ceae33]/90' : 'border-destiny-backup-text/50 from-destiny-backup-text/55 to-transparent hover:from-destiny-backup-text/80 active:to-destiny-backup-text/20 active:from-destiny-backup-text/90'} flex flex-row items-center pl-2 -bg-linear-45 transition-colors duration-200 cursor-pointer`}
      onClick={onClick}
      onContextMenu={onContextMenu}
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

      <div
        className={`absolute -left-px -top-px border-t border-l ${pinned ? 'border-[#ceae33]/50' : 'border-destiny-main-text/25'} w-3 h-3`}
      ></div>
      <div
        className={`absolute -right-px -top-px border-t border-r ${pinned ? 'border-[#ceae33]/50' : 'border-destiny-main-text/25'} w-3 h-3`}
      ></div>
      <div
        className={`absolute -left-px -bottom-px border-b border-l ${pinned ? 'border-[#ceae33]/50' : 'border-destiny-main-text/25'} w-3 h-3`}
      ></div>
      <div
        className={`absolute -right-px -bottom-px border-b border-r ${pinned ? 'border-[#ceae33]/50' : 'border-destiny-main-text/25'} w-3 h-3`}
      ></div>
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

export function TabSeperator({ text, length, maxLength }) {
  return (
    <div className="relative w-60 pt-4 pb-1 flex items-center">
      <div className="flex flex-col w-full">
        <div className="flex flex-row w-full justify-between">
          <span className="text-destiny-backup-text text-lg">{text}</span>
          <span className="text-destiny-backup-text text-lg">
            {length}
            <b>/</b>
            {maxLength}
          </span>
        </div>
        <div className="border-b-2 border-destiny-backup-text flex-1"></div>
      </div>
    </div>
  )
}
