import Panel from "./Panel";
import DataRow from "./DataRow";
import GetArchives from "../hooks/useGetArchives";

export default function ArchivesPanel() {
  const { data, isFetching, error, refetch } = GetArchives();
  console.log(data);
  return (
    <Panel
      title="Archive History"
      isFetching={isFetching}
      error={error}
      refetch={refetch}
    >
      {data !== null && !data?.error && !isFetching && !error && (
        <div className="flex flex-col gap-3">
          <DataRow label="First Scan" value={data?.firstScan || "-"} />
          <DataRow label="Last Scan" value={data?.lastScan || "-"} />
          <DataRow label="Total Scans" value={data?.totalScans || "-"} />
          <DataRow label="Change Count" value={data?.changeCount || "-"} />
          <DataRow
            label="Avg Size"
            value={
              data?.averagePageSize ? `${data?.averagePageSize} bytes` : "-"
            }
          />
          <DataRow
            label="Avg Size"
            value={
              data?.averagePageSize ? `${data?.averagePageSize} bytes` : "-"
            }
          />
          <DataRow
            label="Avg Scans Per Day"
            value={data?.scanFrequency?.scansPerDay || "-"}
          />
          <DataRow
            label="Avg Days between Scans"
            value={data?.scanFrequency?.daysBetweenScans || "-"}
          />
          <DataRow label="Scan URL" value={data?.scanUrl || "-"} />
        </div>
      )}
    </Panel>
  );
}
