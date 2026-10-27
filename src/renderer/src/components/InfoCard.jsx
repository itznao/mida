export function InfoCard({ title, description, hueRotate, onClose }) {
  return (
    <div className="z-1000 absolute w-full h-full flex flex-col justify-center items-center">
      <div className="relative h-1/2 w-full bg-black/50 flex flex-col">
        <div
          style={{ filter: `hue-rotate(${hueRotate}deg)` }}
          className="w-full h-2 bg-red-500"
        ></div>
        <div className="grid grid-rows-1 grid-cols-3 grid-cols-[1fr_1.8fr_1fr] h-full">
          <div className="bg-black/90 h-full flex flex-row-reverse">
            <img
              style={{ filter: `hue-rotate(${hueRotate}deg)` }}
              className="w-40 h-40"
              src="images/popup.png"
              alt=""
            />
          </div>
          <div className="bg-black/80 h-full p-4 flex flex-col gap-8">
            <h2 className="text-white text-3xl tracking-[0.5rem]">{title.toUpperCase()}</h2>
            <span className="text-white whitespace-pre-line">{description}</span>
          </div>
          <div className="bg-black/80 h-full"></div>
        </div>
        <div className="w-full h-8 bg-black/98 pl-1/3 grid grid-rows-1 grid-cols-3 grid-cols-[1fr_1.8fr_1fr]">
          <div></div>
          <div>
            <button onClick={onClose} className="text-white pl-4 cursor-pointer">
              <span className="font-destiny-icons pr-1"></span>Dismiss
            </button>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  )
}
