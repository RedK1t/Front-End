import ArchivesPanel from "./components/ArchivesPanel";
import CookiesPanel from "./components/CookiesPanel";
import DnsRecordsPanel from "./components/DnsRecordsPanel";
import DnsServerPanel from "./components/DnsServerPanel";
import FirewallPanel from "./components/FirewallPanel";
import HttpSecurityPanel from "./components/HttpSecurityPanel";
import LinkedPagesPanel from "./components/LinkedPagesPanel";
import RobotsTxtPanel from "./components/RobotsTxtPanel";
import SitemapPanel from "./components/SitemapPanel";
import SslPanel from "./components/SslPanel";
import SubDomainsPanel from "./components/SubDomainsPanel";
import WhoisPanel from "./components/WhoisPanel";

export default function Reconnaissance() {
  return (
    <div className="mx-auto h-full w-11/12 columns-1 gap-5 py-12 *:mb-5 *:break-inside-avoid md:columns-2 xl:columns-3">
      <WhoisPanel />
      <CookiesPanel />
      <DnsRecordsPanel />
      <ArchivesPanel />
      <SubDomainsPanel />
      <DnsServerPanel />
      <FirewallPanel />
      <HttpSecurityPanel />
      <LinkedPagesPanel />
      <RobotsTxtPanel />
      <SitemapPanel />
      <SslPanel />
    </div>
  );
}
