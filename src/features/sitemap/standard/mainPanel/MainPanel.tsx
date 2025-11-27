import EndpointsTable from "./components/EndpointsTable";
export default function MainPanel() {
  return (
    <div className="mx-auto flex h-full w-11/12 flex-col overflow-hidden py-5">
      <EndpointsTable />
    </div>
  );
}
