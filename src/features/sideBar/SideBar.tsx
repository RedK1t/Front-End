import { createPortal } from "react-dom";
import overviewIcon from "../../assets/overviewIcon.svg";
import searchIcon from "../../assets/SearchIcon.svg";
import scannerIcon from "../../assets/VulnerabilityScannerIcon.svg";
import sitemapIcon from "../../assets/sitemapIcon.svg";
import scopeAndFiltersIcon from "../../assets/scopeAndFiltersIcon.svg";
import interceptorIcon from "../../assets/interceptorIcon.svg";
import intruderIcon from "../../assets/IntruderIcon.svg";
import proxyIcon from "../../assets/navProxyIcon.svg";
import reportIcon from "../../assets/reportIcon.svg";
import toolsIcon from "../../assets/toolsIcon.svg";
// import settingsIcon from "../../assets/settingsIconCropped.svg";
import { useEffect, useRef, useState } from "react";
import NavItem from "./NavItem";
import ThemeToggle from "./ThemeToggle";
import { useDomain } from "@/context/DomainContext";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { domain, selectedSubdomain } = useDomain();

  // Handle SideBar Open/Close on Mouse Enter/Leave
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const handleMouseEnter = () => setIsOpen(true);
    const handleMouseLeave = () => setIsOpen(false);

    node.addEventListener("mouseenter", handleMouseEnter);
    node.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      node.removeEventListener("mouseenter", handleMouseEnter);
      node.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const sidebarRoot = document.getElementById("sidebar");
  if (!sidebarRoot) return null;

  // SideBar Portal
  return createPortal(
    <div
      ref={ref}
      className={`bg-gray fixed top-1/2 left-0 z-50 flex -translate-y-1/2 transform-gpu flex-col items-start gap-1 overflow-hidden rounded-r-[14px] py-4 pr-4 pl-1 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] transition-[width] duration-300 ease-out ${isOpen ? "w-80" : "w-12"}`}
    >
      {/* NavItem */}
      <NavItem icon={overviewIcon} text="Overview" to="/" isOpen={isOpen} />

      <NavItem
        icon={searchIcon}
        text="Reconnaissance"
        to="/reconnaissance"
        isOpen={isOpen}
        disabled={!domain}
      />

      <NavItem
        icon={proxyIcon}
        text="Proxy"
        to="/proxy"
        isOpen={isOpen}
        nested={true}
      >
        <NavItem
          icon={sitemapIcon}
          text="Sitemap"
          to="/proxy/sitemap/standard"
          isOpen={isOpen}
          disabled={
            !domain || !selectedSubdomain || !selectedSubdomain.includes(domain)
          }
        />
        <NavItem
          icon={scopeAndFiltersIcon}
          text="Scope and Filters"
          to="/proxy/scope"
          isOpen={isOpen}
        />
        <NavItem
          icon={interceptorIcon}
          text="Interceptor"
          to="/proxy/interceptor"
          isOpen={isOpen}
        />
        <NavItem
          icon={intruderIcon}
          text="Intruder"
          to="/proxy/intruder"
          isOpen={isOpen}
        />
      </NavItem>

      <NavItem
        icon={scannerIcon}
        text="AI Vulnerability Scanner"
        to="/AiScanner"
        isOpen={isOpen}
      />

      <NavItem
        icon={reportIcon}
        text="Report Generation"
        to="/AiReport"
        isOpen={isOpen}
      />

      <div
        className={`${isOpen ? "w-full" : "w-0"} border-t border-white/40`}
      />
      <NavItem
        icon={toolsIcon}
        text="Tools & Utilities"
        to="/tools"
        isOpen={isOpen}
      />

      {/* <NavItem
        icon={settingsIcon}
        text="Settings"
        to="/settings"
        isOpen={isOpen}
      /> */}

      <div className={`mt-1 w-full ${isOpen ? "px-1" : ""}`}>
        <ThemeToggle isOpen={isOpen} />
      </div>
    </div>,
    sidebarRoot,
  );
}
