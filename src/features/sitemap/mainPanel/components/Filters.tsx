import { Input } from "@/components/ui/input";
import SelectFilter from "./SelectFilter";
import SwitchFilter from "./SwitchFilter";
import mindMapIcon from "@/assets/mind-map.svg";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export default function Filters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get Filters from Search Params
  const isStandard = searchParams.get("Standard") || "true";
  const isCapturing = searchParams.get("Capturing") || "true";

  // Set Filters to Search Params
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("Standard", isStandard);
    newSearchParams.set("Capturing", isCapturing);
    setSearchParams(newSearchParams, { replace: true });
  }, [isStandard, isCapturing, searchParams, setSearchParams]);
  return (
    <>
      {/* <SwitchFilter offText="Idle" onText="Capturing" onIcon="I" offIcon="O" /> */}
      <SwitchFilter
        offText="Hierarchical"
        onText="Standard"
        onIcon="/"
        offIcon={mindMapIcon}
      />
      <SelectFilter placeholder="source" options={["active", "passive"]} />
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

      <Input
        placeholder="Search for Endpoints"
        className="small-text bg-gray col-span-2 max-w-[250px] border-0"
        value={searchParams.get("Search") || ""}
        onChange={(e) => {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set("Search", e.target.value);
          setSearchParams(newSearchParams, { replace: true });
        }}
      />
    </>
  );
}
