import Filters from "./Filters";
import TableRow from "./TableRow";

export default function EndpointsTable() {
  return (
    <div className="text-yellowish-white flex h-full w-full flex-col gap-y-2 overflow-hidden py-2">
      <Filters />
      <div className="flex h-full w-full flex-col gap-y-2 overflow-auto">
        <TableRow
          lastSeen="Last Seen"
          source="Source"
          status="Status"
          method="Method"
          path="Path"
        />
        <TableRow
          lastSeen="2 min ago"
          source="Active"
          status="200"
          method="GET"
          path="/api/users"
        />
        <TableRow
          lastSeen="5 min ago"
          source="Passive"
          status="201"
          method="POST"
          path="/api/users"
        />
        <TableRow
          lastSeen="12 min ago"
          source="Active"
          status="404"
          method="GET"
          path="/api/legacy"
        />
        <TableRow
          lastSeen="1 hour ago"
          source="Passive"
          status="200"
          method="PUT"
          path="/api/profile"
        />
        <TableRow
          lastSeen="1 hour ago"
          source="Passive"
          status="200"
          method="DELETE"
          path="/api/profile"
        />
        <TableRow
          lastSeen="1 hour ago"
          source="Passive"
          status="200"
          method="PUT"
          path="/api/profile"
        />
      </div>
    </div>
  );
}
