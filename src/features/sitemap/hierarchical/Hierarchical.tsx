import "@xyflow/react/dist/style.css";
import GraphPanel from "./graphPanel/GraphPanel";
import StandardSwitch from "@/features/sitemap/standard/mainPanel/components/StandardSwitch";
import SelectFilter from "../standard/mainPanel/components/SelectFilter";
import useGetEndpoints from "../hooks/useGetEndpoints";

export default function Hierarchical() {
  const { endpoints } = useGetEndpoints();
  return (
    <div className="relative h-full w-full">
      <div className="absolute top-7.5 left-24 z-10 flex items-center gap-5">
        <StandardSwitch />
        <SelectFilter
          placeholder="subdomain"
          options={endpoints?.map((ep) => ep.url.split("/")[2]) || []}
        />
      </div>
      <GraphPanel />
    </div>
  );
}
