import useGetHttpSecurity from "../hooks/useGetHttpSecurity";
import DataRow from "./DataRow";
import Panel from "./Panel";

export default function HttpSecurityPanel() {
  const { data, isFetching, error, refetch } = useGetHttpSecurity();
  return (
    <Panel
      title="HTTP Security"
      isFetching={isFetching}
      error={error}
      refetch={refetch}
    >
      <DataRow
        label="Content Security Policy"
        value={data?.contentSecurityPolicy ? "✅ Yes" : "❌ No"}
      />
      <DataRow
        label="Strict Transport Policy"
        value={data?.strictTransportPolicy ? "✅ Yes" : "❌ No"}
      />
      <DataRow
        label="X-Content-Type-Options"
        value={data?.xContentTypeOptions ? "✅ Yes" : "❌ No"}
      />
      <DataRow
        label="X-Frame-Options"
        value={data?.xFrameOptions ? "✅ Yes" : "❌ No"}
      />
      <DataRow
        label="X-XSS-Protection"
        value={data?.xXSSProtection ? "✅ Yes" : "❌ No"}
      />
    </Panel>
  );
}
