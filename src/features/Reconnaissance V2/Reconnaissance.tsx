import ArchivesPanel from "./components/ArchivesPanel";
import CookiesPanel from "./components/CookiesPanel";
import DnsRecordsPanel from "./components/DnsRecordsPanel";
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
    </div>
  );
}
