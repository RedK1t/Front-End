import { Input } from "@/components/ui/input";
import SelectFilter from "./SelectFilter";
import SwitchFilter from "./SwitchFilter";
import mindMapIcon from "@/assets/mind-map.svg";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export default function Filters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isStandard = searchParams.get("Standard") || "true";
  const isCapturing = searchParams.get("Capturing") || "true";
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("Standard", isStandard);
    newSearchParams.set("Capturing", isCapturing);
    setSearchParams(newSearchParams, { replace: true });
  }, [isStandard, isCapturing, searchParams, setSearchParams]);
  return (
    <div className="flex flex-row-reverse items-center justify-between">
      <Input
        placeholder="Search for Endpoints"
        className="small-text bg-gray max-w-[200px] border-0"
      />
      <SelectFilter
        placeholder="status code"
        options={[
          "200",
          "201",
          "204",
          "301",
          "302",
          "400",
          "401",
          "403",
          "404",
          "500",
        ]}
      />
      <SelectFilter
        placeholder="method"
        options={["GET", "POST", "PUT", "DELETE"]}
      />
      <SelectFilter placeholder="source" options={["active", "passive"]} />
      <SwitchFilter offText="Idle" onText="Capturing" onIcon="I" offIcon="O" />
      <SwitchFilter
        offText="Hierarchical"
        onText="Standard"
        onIcon="/"
        offIcon={mindMapIcon}
      />
    </div>
  );
}
