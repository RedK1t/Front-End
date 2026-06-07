import SelectFilter from "@/features/sitemap/standard/mainPanel/components/SelectFilter";
import { type ChangeEvent, useState, useMemo, useEffect } from "react";
import { FaPlay, FaPlus, FaStop } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { PAYLOAD_PRESETS } from "../constant/payloads";
import useProxyActions from "../../Interceptor/hooks/useProxyActions";
import useProxyTraffic from "../../Interceptor/hooks/useProxyTraffic";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PayloadSet = {
  id: number;
  payloads: string;
};

export default function PayloadsPanel({
  requestTemplate,
}: {
  requestTemplate: string;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { startIntruderAttack, stopIntruderAttack } = useProxyActions();
  const { intruderIsRunning } = useProxyTraffic();
  const queryClient = useQueryClient();

  const attackType =
    searchParams.get("Attack Type") || "Sniper - Single position at a time";

  const ATTACK_TYPE_MAP: Record<string, string> = {
    "Sniper - Single position at a time": "sniper",
    "Battering Ram - Same payload everywhere": "battering_ram",
    "Pitchfork - Parallel payloads": "pitchfork",
    "Cluster Bomb - All combinations": "cluster_bomb",
  };

  const handleStartAttack = () => {
    if (!requestTemplate) return;

    // Extract target URL from Host header if possible
    let target = "";
    const hostMatch = requestTemplate.match(/^Host:\s*(.*)$/im);
    if (hostMatch && hostMatch[1]) {
      const host = hostMatch[1].trim();
      // Default to https if not specified, or try to infer from template
      target = host.startsWith("http") ? host : `https://${host}`;
    }

    const payloadSetsArray = payloadSets.map((set) =>
      set.payloads
        .split("\n")
        .map((p) => p.trim())
        .filter((p) => p !== ""),
    );

    // Clear previous results before starting a new attack
    queryClient.setQueryData(["intruder_results"], () => []);

    startIntruderAttack({
      raw: requestTemplate,
      attack_type: ATTACK_TYPE_MAP[attackType] || "sniper",
      payload_sets: payloadSetsArray,
      target: target,
      threads: 10,
      timeout: 30,
      follow_redirects: false,
    });
  };

  // Count §...§ positions and extract default values
  const positions = useMemo(() => {
    const matches = [...requestTemplate.matchAll(/§(.*?)§/g)];
    return matches.map((m, i) => ({
      index: i + 1,
      defaultValue: m[1] || `position ${i + 1}`,
    }));
  }, [requestTemplate]);

  const positionCount = positions.length;

  // Determine how many payload sets are needed
  const requiredSetsCount = useMemo(() => {
    if (
      attackType.includes("Pitchfork") ||
      attackType.includes("Cluster Bomb")
    ) {
      return Math.max(1, positionCount);
    }
    return 1; // Sniper, Battering Ram
  }, [attackType, positionCount]);

  const [payloadSets, setPayloadSets] = useState<PayloadSet[]>([
    { id: 1, payloads: "" },
  ]);

  const [activeSetIndex, setActiveSetIndex] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState("");

  // Sync payload sets when required count changes
  useEffect(() => {
    setPayloadSets((prev) => {
      if (prev.length === requiredSetsCount) return prev;
      if (prev.length < requiredSetsCount) {
        const newSets = [...prev];
        for (let i = prev.length; i < requiredSetsCount; i++) {
          newSets.push({ id: i + 1, payloads: "" });
        }
        return newSets;
      }
      return prev.slice(0, requiredSetsCount);
    });

    if (activeSetIndex >= requiredSetsCount) {
      setActiveSetIndex(0);
    }
    setSelectedPreset("");
  }, [requiredSetsCount]);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedPreset("");
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        setPayloadSets((prev) =>
          prev.map((set, i) =>
            i === activeSetIndex ? { ...set, payloads: content } : set,
          ),
        );
      }
      e.target.value = "";
    };
    reader.readAsText(file);
  };

  const handleLoadPreset = (presetName: string) => {
    setSelectedPreset(presetName);
    const preset = PAYLOAD_PRESETS[presetName];
    if (preset) {
      const content = preset.join("\n");
      setPayloadSets((prev) =>
        prev.map((set, i) =>
          i === activeSetIndex ? { ...set, payloads: content } : set,
        ),
      );
    }
  };

  return (
    <div className="flex h-full w-full flex-col gap-2.5 py-2.5 pr-3 pl-14">
      {/* Payloads Panel Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="mid-text text-yellowish-white">Payloads</h2>
          <span className="normal-text text-dark-yellowish-white">
            {positionCount} position{positionCount !== 1 ? "s" : ""} found
          </span>
        </div>

        {requiredSetsCount > 1 && (
          <div className="flex items-center gap-2">
            <span className="small-text text-dark-yellowish-white whitespace-nowrap">
              Payload Set:
            </span>
            <Select
              value={String(activeSetIndex)}
              onValueChange={(val) => {
                setActiveSetIndex(Number(val));
                setSelectedPreset("");
              }}
            >
              <SelectTrigger className="bg-gray small-text border-yellowish-white/10 h-8 w-48 text-white">
                <SelectValue placeholder="Select Set" />
              </SelectTrigger>
              <SelectContent className="bg-gray border-yellowish-white/10 text-white">
                {payloadSets.map((_, i) => (
                  <SelectItem key={i} value={String(i)} className="small-text">
                    Set {i + 1}{" "}
                    {positions[i]?.defaultValue
                      ? `(${positions[i].defaultValue.length > 15 ? positions[i].defaultValue.slice(0, 15) + "..." : positions[i].defaultValue})`
                      : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Payloads Panel Content */}
      <div className="rounded-6px border-yellowish-white/10 bg-gray relative flex flex-1 flex-col overflow-hidden border">
        {/* Helper Instructions */}
        <div className="border-yellowish-white/5 flex items-center justify-between border-b bg-black/20 px-3 py-1.5">
          <span className="text-dark-yellowish-white text-[10px] font-medium tracking-wider uppercase">
            Enter one payload per line
          </span>
          {requiredSetsCount > 1 && (
            <span className="text-red text-[10px] font-bold uppercase">
              Targeting: {positions[activeSetIndex]?.defaultValue || "..."}
            </span>
          )}
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Line Numbers Simulation */}
          <div className="text-yellowish-white/30 border-yellowish-white/5 flex w-10 flex-col items-center border-r bg-black/30 pt-2.5 font-mono text-[10px] select-none">
            {Array.from({
              length: Math.max(
                20,
                (payloadSets[activeSetIndex]?.payloads.split("\n").length ||
                  0) + 1,
              ),
            }).map((_, i) => (
              <div key={i} className="flex h-[21px] items-center">
                {i + 1}
              </div>
            ))}
          </div>

          <textarea
            name="payloads"
            value={payloadSets[activeSetIndex]?.payloads || ""}
            onChange={(e) => {
              setSelectedPreset("");
              const val = e.target.value;
              setPayloadSets((prev) =>
                prev.map((set, i) =>
                  i === activeSetIndex ? { ...set, payloads: val } : set,
                ),
              );
            }}
            placeholder={`Example:\nadmin\nroot\nuser123`}
            className="text-yellowish-white coding-text h-full w-full flex-1 resize-none overflow-auto bg-transparent p-2.5 leading-[21px] focus:outline-none"
          />
        </div>
      </div>

      {/* Payloads Panel Footer */}
      <div className="flex w-full items-center gap-2.5">
        <SelectFilter
          fullWidth={true}
          placeholder="Load Preset"
          options={Object.keys(PAYLOAD_PRESETS)}
          onValueChange={handleLoadPreset}
          value={selectedPreset}
        />
        <div className="flex h-full w-7/10 items-center gap-2.5">
          {/* <input
            type="number"
            name="payload-count"
            defaultValue={10}
            className="bg-gray text-yellowish-white small-text rounded-6px w-full overflow-auto p-2.5 focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
          /> */}
          <label
            htmlFor="custom-payload-upload"
            className="bg-yellowish-white small-text rounded-6px flex h-full w-full cursor-pointer items-center justify-center gap-1 overflow-hidden px-2.5 py-1.5 text-nowrap text-black"
          >
            Upload List
            <FaPlus />
          </label>
        </div>
        <input
          type="file"
          id="custom-payload-upload"
          name="custom-payload-list"
          accept=".txt"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
      <div className="flex items-center gap-2.5">
        <SelectFilter
          fullWidth={true}
          placeholder="Attack Type"
          value={attackType}
          options={[
            "Sniper - Single position at a time",
            "Battering Ram - Same payload everywhere",
            "Pitchfork - Parallel payloads",
            "Cluster Bomb - All combinations",
          ]}
        />
        <div className="flex h-full w-7/10 items-center gap-2.5">
          {!intruderIsRunning ? (
            <button
              onClick={handleStartAttack}
              className="bg-red small-text rounded-6px text-yellowish-white flex h-full w-full cursor-pointer items-center justify-center gap-2 px-2.5 py-1.5 text-nowrap"
            >
              Start
              <FaPlay />
            </button>
          ) : (
            <button
              onClick={stopIntruderAttack}
              className="bg-yellowish-white small-text rounded-6px flex h-full w-full cursor-pointer items-center justify-center gap-2 px-2.5 py-1.5 text-nowrap text-black"
            >
              Stop
              <FaStop />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
