import Table from "@/components/Table/Table";
import useProxyTraffic from "../../Interceptor/hooks/useProxyTraffic";
import useProxyActions from "../../Interceptor/hooks/useProxyActions";
import { useCallback } from "react";

export default function HistoryTable() {
  const { intruderResults } = useProxyTraffic();
  const { getIntruderResponse } = useProxyActions();

  const handleSelectionChange = useCallback(
    (selected: string) => {
      getIntruderResponse(Number(selected));
    },
    [getIntruderResponse],
  );

  const data = intruderResults.map((msg) => {
    const res = msg.result;
    return [
      new Date().toLocaleTimeString(), // Backend 'time' is elapsed time, so we use local time for the row
      res.request || 0,
      res.payload || "",
      res.status_code || 0,
      res.length || 0,
    ];
  });

  return (
    <div className="h-full w-full overflow-y-auto px-3 py-3">
      <Table
        data={data}
        headers={["Time", "#", "Payload", "Status Code", "Length"]}
        idColumnIndex={1}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
}
