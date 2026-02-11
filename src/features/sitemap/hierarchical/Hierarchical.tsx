import "@xyflow/react/dist/style.css";
import GraphPanel from "./graphPanel/GraphPanel";
import StandardSwitch from "@/features/sitemap/standard/mainPanel/components/StandardSwitch";

export default function Hierarchical() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute top-7.5 left-24 z-10 flex items-center gap-5">
        <StandardSwitch />
      </div>
      <GraphPanel />
    </div>
  );
}
