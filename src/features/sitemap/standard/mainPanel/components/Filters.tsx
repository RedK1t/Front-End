import { Input } from "@/components/ui/input";
import SelectFilter from "./SelectFilter";
import { useSearchParams } from "react-router-dom";
// import { useEffect } from "react";
import StandardSwitch from "./StandardSwitch";
// import CapturingSwitch from "./CapturingSwitch";

export default function Filters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get Filters from Search Params
  // const isCapturing = searchParams.get("Capturing") || "true";

  // Set Filters to Search Params
  // useEffect(() => {
  //   const newSearchParams = new URLSearchParams(searchParams);
  //   newSearchParams.set("Capturing", isCapturing);
  //   setSearchParams(newSearchParams, { replace: true });
  // }, [isCapturing, searchParams, setSearchParams]);
  return (
    <div className="flex w-full items-center justify-between gap-2">
      {/* <CapturingSwitch
        offText="Idle"
        onText="Capturing"
        onIcon="I"
        offIcon="O"
      /> */}
      <div className="flex w-1/6 items-center justify-center">
        <StandardSwitch />
      </div>
      <div className="flex w-1/6 items-center justify-center">
        <SelectFilter placeholder="source" options={["Active", "Passive"]} />
      </div>
      <div className="flex w-1/6 items-center justify-center">
        <SelectFilter
          placeholder="statusCode"
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
      </div>
      <div className="flex w-1/6 items-center justify-center">
        <SelectFilter
          placeholder="method"
          options={["GET", "POST", "PUT", "DELETE"]}
        />
      </div>
      <div className="flex w-2/6 items-center justify-center">
        <Input
          placeholder="Search for Endpoints"
          className="small-text bg-gray col-span-2 max-w-[250px] border-0"
          value={searchParams.get("search") || ""}
          onChange={(e) => {
            const newSearchParams = new URLSearchParams(searchParams);
            if (e.target.value === "") {
              newSearchParams.delete("search");
            } else {
              newSearchParams.set("search", e.target.value);
            }
            setSearchParams(newSearchParams, { replace: true });
          }}
        />
      </div>
    </div>
  );
}
