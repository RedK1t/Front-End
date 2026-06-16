import { useEffect, useState } from "react";
import { IoMdArrowDropleft } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";

type NavItemProps = {
  icon: string;
  text: string;
  to: string;
  isOpen: boolean;
  nested?: boolean;
  children?: React.ReactNode;
  disabled?: boolean;
};

export default function NavItem({
  icon,
  text,
  to,
  isOpen,
  nested = false,
  children,
  disabled = false,
}: NavItemProps) {
  const [isNestedOpen, setIsNestedOpen] = useState(false);
  const { pathname } = useLocation();
  const isActive = nested
    ? pathname.split("/")[1].includes(to.split("/")[1])
    : pathname === to;
  const isActiveStyles = "bg-red shadow-red/15 rounded-lg shadow-[0_2px_8px]";

  const handleClick = () => {
    if (nested) {
      setIsNestedOpen(!isNestedOpen);
    }
  };
  useEffect(() => {
    if (!isOpen) {
      setIsNestedOpen(false);
    }
  }, [isOpen]);
  return (
    <div className="flex w-full flex-col">
      <Link
        to={
          disabled
            ? { pathname: location.pathname, search: location.search }
            : nested
              ? { pathname: location.pathname, search: location.search }
              : to
        }
        className={`group flex ${isOpen ? "w-full" : "w-fit"} ${isActive && isOpen ? isActiveStyles : ""} ${disabled ? "cursor-not-allowed opacity-40" : "hover:bg-red"} items-center gap-x-3 rounded-lg pr-7 transition-all duration-200`}
        onClick={disabled ? undefined : handleClick}
      >
        {/* NavItem Icon */}
        <div
          className={`flex h-10 w-10 items-center justify-center ${isActive && !disabled ? isActiveStyles : ""} ${disabled ? "grayscale" : ""}`}
        >
          <img
            src={icon}
            alt={text}
            className={`h-4 w-4 ${disabled ? "opacity-60" : ""} ${
              // White SVG icons are invisible on a light bg. In light theme turn
              // them black; keep them white in dark, when active (red bg), and on
              // hover (link turns red).
              isActive && !disabled
                ? ""
                : "brightness-0 group-hover:brightness-100 dark:brightness-100"
            }`}
          />
        </div>

        {/* NavItem Text — force real white on the red active/hover background
            (the `white` token flips to black in light theme). */}
        <div
          className={`flex items-center gap-x-2 ${isActive ? "text-[#fff]" : ""} ${disabled ? "" : "group-hover:text-[#fff]"}`}
        >
          <p
            className={`normal-text text-nowrap transition-all duration-300 ${isOpen ? "max-w-96" : "max-w-0 opacity-0"}`}
          >
            {text}
          </p>
          {nested && (
            <IoMdArrowDropleft
              className={`h-5 w-5 transition-all duration-300 ${isNestedOpen ? "-rotate-90" : ""}`}
            />
          )}
        </div>
      </Link>
      {nested && (
        <div
          className={`flex flex-col gap-1 overflow-hidden pl-6 transition-all duration-300 ${isNestedOpen ? "mt-3 max-h-96" : "max-h-0"}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
