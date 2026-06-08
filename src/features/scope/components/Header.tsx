import onIcon from "@/assets/onIcon.svg";
import offIcon from "@/assets/offIcon.svg";

type HeaderProps = {
  title: string;
  isOn: boolean;
  onToggle: (enabled: boolean) => void;
};

export default function Header({ title, isOn, onToggle }: HeaderProps) {
  return (
    <div className="border-dark-yellowish-white text-yellowish-white flex items-center justify-between border-b">
      <p className="heading-text">{title}</p>
      <button
        onClick={() => onToggle(!isOn)}
        className={`bg-gray small-text text-yellowish-white rounded-6px flex w-16 cursor-pointer items-center justify-between py-0.5 pr-0.5 pl-1.5`}
      >
        <p
          className={`transition-transform ${isOn ? "" : "translate-x-[160%]"}`}
        >
          {isOn ? "On" : "Off"}
        </p>
        <div
          className={`${isOn ? "bg-red" : "border"} border-red rounded-6px flex h-7 w-7 items-center justify-center transition-all ${isOn ? "" : "-translate-x-[115%]"}`}
        >
          <img
            src={isOn ? onIcon : offIcon}
            alt={isOn ? "offIcon" : "onIcon"}
            className={`${isOn ? "translate-x-[0.5px]" : ""}`}
          />
        </div>
      </button>
    </div>
  );
}
