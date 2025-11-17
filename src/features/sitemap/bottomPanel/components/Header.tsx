export default function Header() {
  return (
    <div className="mx-auto flex w-11/12 items-center justify-between overflow-y-visible py-5">
      {/* left side */}
      <div className="normal-text flex items-center gap-x-2.5">
        <p className="text-white">
          <span>GET </span>
          /api/users
        </p>
        <p className="text-green bg-green-transparent rounded-[5px] px-1 py-0.5">
          201 Created
        </p>
        <p className="text-yellow bg-orange-transparent rounded-[5px] px-1 py-0.5">
          Passive
        </p>
      </div>
      <div className="normal-text flex items-center gap-x-2.5">
        <button className="normal-text bg-gray border-yellowish-white cursor-pointer rounded-[5px] border-[0.5px] px-3 py-1.5 text-center">
          Re-run
        </button>
        <button className="normal-text bg-gray border-yellowish-white cursor-pointer rounded-[5px] border-[0.5px] px-3 py-1.5 text-center">
          Send To
        </button>
        <button className="normal-text bg-gray border-yellowish-white cursor-pointer rounded-[5px] border-[0.5px] px-3 py-1.5 text-center">
          X
        </button>
      </div>
    </div>
  );
}
