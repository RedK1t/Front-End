import { Link } from "react-router-dom";
import ArchivesPanel from "./components/ArchivesPanel";
import CookiesPanel from "./components/CookiesPanel";
import DnsRecordsPanel from "./components/DnsRecordsPanel";
import DnsServerPanel from "./components/DnsServerPanel";
import FirewallPanel from "./components/FirewallPanel";
import HttpSecurityPanel from "./components/HttpSecurityPanel";
import LinkedPagesPanel from "./components/LinkedPagesPanel";
import RobotsTxtPanel from "./components/RobotsTxtPanel";
import ScreenshotPanel from "./components/ScreenshotPanel";
import ServerLocationPanel from "./components/ServerLocationPanel";
import SitemapPanel from "./components/SitemapPanel";
import SslPanel from "./components/SslPanel";
import SubDomainsPanel from "./components/SubDomainsPanel";
import TechStackPanel from "./components/TechStackPanel";
import WhoisPanel from "./components/WhoisPanel";
import { FaArrowLeft } from "react-icons/fa";

export default function Reconnaissance() {
  const panels = [
    <ScreenshotPanel key="screenshot" />,
    <ServerLocationPanel key="server-location" />,
    <WhoisPanel key="whois" />,
    <SubDomainsPanel key="subdomains" />,
    <CookiesPanel key="cookies" />,
    <DnsRecordsPanel key="dns-records" />,
    <DnsServerPanel key="dns-server" />,
    <FirewallPanel key="firewall" />,
    <ArchivesPanel key="archives" />,
    <HttpSecurityPanel key="http-security" />,
    <LinkedPagesPanel key="linked-pages" />,
    <RobotsTxtPanel key="robots-txt" />,
    <SitemapPanel key="sitemap" />,
    <SslPanel key="ssl" />,
    <TechStackPanel key="tech-stack" />,
  ];

  return (
    <div className="mx-auto w-11/12 py-12">
      <div className="flex w-full items-center justify-center pb-5">
        <Link
          to="/reconnaissance"
          className="bg-red/60 rounded-6px normal-text flex w-fit items-center gap-2 px-3 py-1.5 text-[#fff]"
        >
          Switch to Basic Mode <FaArrowLeft />
        </Link>
      </div>
      {/* Mobile: 1 Column */}
      <div className="flex flex-col gap-4 md:hidden">{panels}</div>

      {/* Tablet: 2 Columns */}
      <div className="hidden gap-4 md:flex xl:hidden">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {panels.filter((_, i) => i % 2 === 0)}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {panels.filter((_, i) => i % 2 === 1)}
        </div>
      </div>

      {/* Desktop: 3 Columns */}
      <div className="hidden gap-4 xl:flex">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {panels.filter((_, i) => i % 3 === 0)}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {panels.filter((_, i) => i % 3 === 1)}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          {panels.filter((_, i) => i % 3 === 2)}
        </div>
      </div>
    </div>
  );
}
