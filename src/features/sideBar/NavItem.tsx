import { Link, useLocation } from "react-router-dom";

export default function NavItem({
  icon,
  text,
  to,
  isOpen,
}: {
  icon: string;
  text: string;
  to: string;
  isOpen: boolean;
}) {
  const { pathname } = useLocation();
  const isActive = to === pathname;

  const isActiveStyles = "bg-red shadow-red/30 rounded-lg shadow-[0_0_20px]";
  return (
    <Link
      to={to}
      className={`flex ${isOpen ? "w-full" : "w-fit"} ${isActive && isOpen ? isActiveStyles : ""} hover:bg-red items-center gap-x-3 rounded-lg pr-7 transition-all duration-200`}
    >
      {/* NavItem Icon */}
      <div
        className={`flex h-10 w-10 items-center justify-center ${isActive ? isActiveStyles : ""}`}
      >
        <img src={icon} alt={text} className={`h-4 w-4`} />
      </div>

      {/* NavItem Text */}
      <p
        className={`normal-text text-nowrap transition-all duration-300 ${isOpen ? "max-w-96" : "max-w-0 opacity-0"}`}
      >
        {text}
      </p>
    </Link>
  );
}
