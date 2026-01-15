import Table from "@/components/Table/Table";
const data = [
  ["2025-01-01 12:00:00", 1, "Payload1", 200, 100],
  ["2025-01-01 12:01:00", 2, "Payload2", 404, 200],
  ["2025-01-01 12:02:00", 3, "Payload3", 500, 300],
  ["2025-01-01 12:00:00", 4, "Payload4", 200, 100],
  ["2025-01-01 12:01:00", 5, "Payload5", 404, 200],
  ["2025-01-01 12:02:00", 6, "Payload6", 500, 300],
  ["2025-01-01 12:00:00", 7, "Payload7", 200, 100],
  ["2025-01-01 12:01:00", 8, "Payload8", 404, 200],
  ["2025-01-01 12:02:00", 9, "Payload9", 500, 300],
  ["2025-01-01 12:00:00", 10, "Payload10", 200, 100],
  ["2025-01-01 12:01:00", 11, "Payload11", 404, 200],
  ["2025-01-01 12:02:00", 12, "Payload12", 500, 300],
];
export default function HistoryTable() {
  return (
    <div className="h-full w-full overflow-y-auto px-3 py-3">
      <Table
        data={data}
        headers={["Time", "#", "Payload", "Status Code", "Length"]}
      />
    </div>
  );
}
