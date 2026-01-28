import useGetDnsServer from "../hooks/useGetDnsServer";
import DataRow from "./DataRow";
import Panel from "./Panel";

export default function DnsServerPanel() {
  const { data, isFetching, error, refetch } = useGetDnsServer();
  return (
    <Panel
      title="DNS Servers"
      isFetching={isFetching}
      error={error}
      refetch={refetch}
    >
      <div className="flex flex-col gap-5">
        {data?.dns.map((dns, index) => {
          return (
            <div key={`dns-${index}`} className="flex flex-col gap-2">
              {data.dns.length > 1 && <h3>DNS Server #{index + 1}</h3>}
              <DataRow
                label="IP Address"
                value={dns.address}
                key={`ip-${index}`}
              />
              {dns.hostname && (
                <DataRow
                  label="Hostname"
                  value={dns.hostname}
                  key={`host-${index}`}
                />
              )}
              <DataRow
                label="DoH Support"
                value={dns.dohDirectSupports ? "✅ Yes*" : "❌ No*"}
                key={`doh-${index}`}
              />
            </div>
          );
        })}
        {data?.dns && data.dns.length > 0 && (
          <small>
            * DoH Support is determined by the DNS server's response to a DoH
            query. Sometimes this gives false negatives, and it's also possible
            that the DNS server supports DoH but does not respond to DoH
            queries. If the DNS server does not support DoH, it may still be
            possible to use DoH by using a DoH proxy.
          </small>
        )}
      </div>
    </Panel>
  );
}
