import DnsRecordsPanel from "./components/DnsRecords";
import SubDomainsPanel from "./components/SubDomainsPanel";
import WhoisPanel from "./components/WhoisPanel";

export default function Reconnaissance() {
  return (
    <div className="mx-auto flex h-full w-11/12 flex-wrap justify-center gap-4 py-12">
      <WhoisPanel />
      <DnsRecordsPanel />
      <SubDomainsPanel />
    </div>
  );
}
