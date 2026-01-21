import Loader from "@/components/Loader";
import useWhoisDnsRecords from "../../Reconnaissance/hooks/useWhoisDnsRecords";
import DataRow from "./DataRow";
import Panel from "./Panel";

export default function DnsRecordsPanel() {
  const { data, error, isLoading } = useWhoisDnsRecords();

  return (
    <Panel title="DNS Records">
      {error && (
        <div className="flex items-center justify-center">
          <p className="text-red-500">{error.message}</p>
        </div>
      )}
      {isLoading && (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      )}
      {data?.success && data.dns?.records.MX && (
        <DataRow
          label="MX"
          value={
            data.dns?.records.MX
              ? data.dns.records.MX.map(
                  (mx) => `Priority: ${mx.priority} - ${mx.exchange}`,
                )
              : "-"
          }
        />
      )}
      {data?.success && data.dns?.records.SRV && (
        <DataRow
          label="SRV"
          value={
            data.dns?.records.SRV
              ? data.dns.records.SRV.map(
                  (srv) =>
                    `Priority: ${srv.priority} - Weight: ${srv.weight} - Port: ${srv.port} - Target: ${srv.name}`,
                )
              : "-"
          }
        />
      )}
      {data?.success &&
        data.dns &&
        Object.entries(data.dns.records)
          .filter(
            ([type, records]) =>
              records !== null &&
              !["MX", "SRV"].includes(type) &&
              Array.isArray(records) &&
              records.every((item) => typeof item === "string"),
          )
          .map(([type, records]) => (
            <DataRow key={type} label={type} value={records} />
          ))}
    </Panel>
  );
}
