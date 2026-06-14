import { useMemo, useState } from "react";
import { IoCopyOutline } from "react-icons/io5";
import { FaCheck } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  REV_SHELLS,
  LISTENERS,
  SHELLS,
  ENCODINGS,
  fillTemplate,
  generateCommand,
  type Encoding,
  type OS,
} from "../data/reverseShells";

const OS_FILTERS: { value: "all" | OS; label: string }[] = [
  { value: "all", label: "All" },
  { value: "linux", label: "Linux" },
  { value: "windows", label: "Windows" },
  { value: "mac", label: "macOS" },
];

function CopyButton({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      title="Copy to clipboard"
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className={`rounded-6px flex items-center justify-center bg-white/10 p-2 text-white transition-colors hover:bg-white/20 ${className}`}
    >
      {copied ? (
        <FaCheck className="text-green h-4 w-4" />
      ) : (
        <IoCopyOutline className="h-4 w-4" />
      )}
    </button>
  );
}

export default function ReverseShellGenerator() {
  const [ip, setIp] = useState("10.10.10.10");
  const [port, setPort] = useState("9001");
  const [shell, setShell] = useState("/bin/bash");
  const [encoding, setEncoding] = useState<Encoding>("none");
  const [osFilter, setOsFilter] = useState<"all" | OS>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(REV_SHELLS[0].id);

  const filtered = useMemo(
    () =>
      REV_SHELLS.filter(
        (rs) =>
          (osFilter === "all" || rs.os.includes(osFilter)) &&
          rs.label.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [osFilter, search],
  );

  const selected =
    REV_SHELLS.find((rs) => rs.id === selectedId) ?? REV_SHELLS[0];
  const command = generateCommand(selected, { ip, port, shell }, encoding);

  return (
    <div className="bg-gray rounded-6px flex flex-col gap-6 border border-white/10 p-6">
      {/* Controls */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1.5">
          <span className="small-text text-yellowish-white">IP / LHOST</span>
          <Input
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="10.10.10.10"
            className="bg-black text-white border-white/10"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="small-text text-yellowish-white">Port / LPORT</span>
          <Input
            value={port}
            onChange={(e) => setPort(e.target.value)}
            placeholder="9001"
            className="bg-black text-white border-white/10"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="small-text text-yellowish-white">Shell</span>
          <Select value={shell} onValueChange={setShell}>
            <SelectTrigger className="bg-black border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray border-white/10 text-white">
              {SHELLS.map((s) => (
                <SelectItem key={s.value} value={s.value} className="small-text">
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="small-text text-yellowish-white">Encoding</span>
          <Select
            value={encoding}
            onValueChange={(v) => setEncoding(v as Encoding)}
          >
            <SelectTrigger className="bg-black border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray border-white/10 text-white">
              {ENCODINGS.map((e) => (
                <SelectItem key={e.value} value={e.value} className="small-text">
                  {e.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>
      </div>

      {/* Generated command */}
      <div className="flex flex-col gap-2">
        <span className="small-text text-yellowish-white">
          {selected.label} — generated command
        </span>
        <div className="relative">
          <pre className="coding-text text-green rounded-6px max-h-40 overflow-auto border border-white/10 bg-black p-4 pr-14 break-all whitespace-pre-wrap">
            {command}
          </pre>
          <CopyButton text={command} className="absolute top-3 right-3" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Payload picker */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Select
              value={osFilter}
              onValueChange={(v) => setOsFilter(v as "all" | OS)}
            >
              <SelectTrigger className="bg-black border-white/10 text-white w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray border-white/10 text-white">
                {OS_FILTERS.map((o) => (
                  <SelectItem
                    key={o.value}
                    value={o.value}
                    className="small-text"
                  >
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search payloads…"
              className="bg-black text-white border-white/10 flex-1"
            />
          </div>
          <div className="hide-scrollbar flex max-h-72 flex-col gap-1 overflow-y-auto rounded-6px border border-white/10 bg-black p-1.5">
            {filtered.length === 0 ? (
              <p className="small-text text-dark-yellowish-white p-3">
                No payloads match.
              </p>
            ) : (
              filtered.map((rs) => (
                <button
                  key={rs.id}
                  type="button"
                  onClick={() => setSelectedId(rs.id)}
                  className={`small-text rounded-6px flex items-center justify-between px-3 py-2 text-left transition-colors ${
                    rs.id === selectedId
                      ? "bg-red text-white"
                      : "text-yellowish-white hover:bg-white/5"
                  }`}
                >
                  {rs.label}
                  <span className="text-[10px] opacity-60">
                    {rs.os.join(" · ")}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Listeners */}
        <div className="flex flex-col gap-3">
          <span className="small-text text-yellowish-white">Listeners</span>
          <div className="hide-scrollbar flex max-h-[22.5rem] flex-col gap-2 overflow-y-auto">
            {LISTENERS.map((l) => {
              const cmd = fillTemplate(l.template, { ip, port, shell });
              return (
                <div
                  key={l.id}
                  className="rounded-6px border border-white/10 bg-black p-3"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="small-text text-white">{l.label}</span>
                    <CopyButton text={cmd} />
                  </div>
                  <pre className="coding-text text-green overflow-auto break-all whitespace-pre-wrap">
                    {cmd}
                  </pre>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
