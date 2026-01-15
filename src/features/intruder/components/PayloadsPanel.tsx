import SelectFilter from "@/features/sitemap/standard/mainPanel/components/SelectFilter";
import { type ChangeEvent, useState } from "react";
import { FaPlay, FaPlus, FaStop } from "react-icons/fa";

export default function PayloadsPanel() {
  const [payloads, setPayloads] = useState("");

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === "string") {
        setPayloads(content);
      }
      // Reset the input value so the same file can be uploaded again
      e.target.value = "";
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex h-full w-full flex-col gap-2.5 py-2.5 pr-3 pl-14">
      {/* Payloads Panel Header */}
      <div className="flex items-center gap-2">
        <h2 className="mid-text text-yellowish-white">Payloads</h2>
        <span className="normal-text text-dark-yellowish-white">
          (Use § for positions)
        </span>
      </div>

      {/* Payloads Panel Content */}
      <textarea
        name="payloads"
        id=""
        value={payloads}
        onChange={(e) => setPayloads(e.target.value)}
        className="bg-gray text-yellowish-white coding-text rounded-6px h-full min-h-25 w-full overflow-auto p-2.5 focus:outline-none"
      />

      {/* Payloads Panel Footer */}
      <div className="flex w-full items-center gap-2.5">
        <SelectFilter
          fullWidth={true}
          placeholder="Load Preset"
          options={[
            "Common Passwords",
            "Common Usernames",
            "SQL Injection",
            "XSS Payloads",
            "Path Traversal",
          ]}
        />
        <div className="flex h-full w-7/10 items-center gap-2.5">
          <input
            type="number"
            name="payload-count"
            defaultValue={10}
            className="bg-gray text-yellowish-white small-text rounded-6px w-full overflow-auto p-2.5 focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <label
            htmlFor="custom-payload-upload"
            className="bg-yellowish-white small-text rounded-6px flex h-full w-full cursor-pointer items-center justify-center gap-1 overflow-hidden px-2.5 py-1.5 text-nowrap text-black"
          >
            Upload Custom List
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
          options={[
            "Sniper - Single position at a time",
            "Battering Ram - Same payload everywhere",
            "Pitchfork - Parallel payloads",
            "Cluster Bomb - All combinations",
          ]}
        />
        <div className="flex h-full w-7/10 items-center gap-2.5">
          <button className="bg-red small-text rounded-6px text-yellowish-white flex h-full w-full cursor-pointer items-center justify-center gap-2 px-2.5 py-1.5 text-nowrap">
            Start
            <FaPlay />
          </button>
          <button className="bg-yellowish-white small-text rounded-6px flex h-full w-full cursor-pointer items-center justify-center gap-2 px-2.5 py-1.5 text-nowrap text-black">
            Stop
            <FaStop />
          </button>
        </div>
      </div>
    </div>
  );
}
