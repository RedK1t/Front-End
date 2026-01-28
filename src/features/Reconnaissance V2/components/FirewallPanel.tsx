import useGetFirewall from "../hooks/useGetFirewall";
import DataRow from "./DataRow";
import Panel from "./Panel";

export default function FirewallPanel() {
  const { data, isFetching, error, refetch } = useGetFirewall();
  return (
    <Panel
      title="Firewall"
      isFetching={isFetching}
      error={error}
      refetch={refetch}
    >
      <DataRow label="Firewall" value={data?.hasWaf ? "✅ Yes" : "❌ No*"} />
      {data?.waf && <DataRow label="WAF" value={data.waf} />}
      {!data?.hasWaf && (
        <p>
          *The domain may be protected with a proprietary or custom WAF which we
          were unable to identify automatically
        </p>
      )}
    </Panel>
  );
}
