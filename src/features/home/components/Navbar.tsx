import redKitLogo from "../../../assets/redKitLogo.svg";
import searchIcon from "../../../assets/SearchIcon.svg";
import accountIcon from "../../../assets/accountIcon.svg";
import notificationIcon from "../../../assets/notificationIcon.svg";
import settingsIcon from "../../../assets/settingsIcon.svg";

export default function Navbar() {
  return (
    <div className="bg-gray mx-auto mt-6 flex w-11/12 items-center justify-between rounded-2xl px-3 py-2">
      <div className="flex cursor-pointer items-center gap-1">
        <img src={redKitLogo} alt="RedKit Logo" />
        <h1 className="large-text text-white">
          <span className="text-dark-red">Red</span>
          Kit
        </h1>
      </div>

      <div className="hidden items-center gap-2 rounded-xl bg-black px-1 py-1.5 md:flex md:w-5/12 lg:w-4/12">
        <img src={searchIcon} alt="Search Icon" />
        <input
          type="text"
          className="placeholder:small-text w-full placeholder:text-white/20 focus:outline-0"
          placeholder=" Search for a previous target"
        ></input>
      </div>

      <div className="flex items-center gap-2">
        <img src={accountIcon} alt="Account Icon" className="cursor-pointer" />
        <img
          src={notificationIcon}
          alt="Notification Icon"
          className="cursor-pointer"
        />
        <img
          src={settingsIcon}
          alt="Settings Icon"
          className="cursor-pointer"
        />
      </div>
    </div>
  );
}
