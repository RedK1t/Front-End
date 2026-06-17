import { FaCheck } from "react-icons/fa6";
import Loader from "@/components/Loader";
import type { ConnectionPhase } from "../context/ProxySessionContext";

interface ProxyConnectingProps {
  /** Current lifecycle phase (drives which step is active). */
  phase: ConnectionPhase;
  /** 0-100 progress estimate. */
  progress: number;
}

const STEPS = [
  "Requesting session",
  "Booting isolated browser",
  "Starting proxy engine",
  "Securing channel",
  "Connected",
];

// Map the session phase to the index of the step currently in progress.
function activeStep(phase: ConnectionPhase, progress: number): number {
  switch (phase) {
    case "opening":
      return 0;
    case "waiting":
      return progress < 50 ? 1 : 2;
    case "ready":
      return 3;
    case "connected":
      return 4;
    default:
      return 0;
  }
}

export default function ProxyConnecting({
  phase,
  progress,
}: ProxyConnectingProps) {
  const complete = phase === "connected";
  const step = activeStep(phase, progress);
  const pct = complete ? 100 : Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div className="bg-black flex min-h-screen w-full flex-col items-center justify-center p-6 transition-all duration-500">
      <div
        className={`bg-gray/40 w-full max-w-md rounded-2xl border p-8 shadow-2xl transition-all duration-500 ${
          complete ? "border-green/40 scale-[1.01]" : "border-red/15"
        }`}
      >
        {/* Header */}
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="relative">
            <div
              className={`absolute -inset-3 rounded-full blur-2xl ${
                complete ? "bg-green/15" : "bg-red/10 animate-pulse"
              }`}
            />
            <div
              className={`bg-gray/60 relative flex h-16 w-16 items-center justify-center rounded-2xl border-2 transition-colors duration-500 ${
                complete ? "border-green/40" : "border-red/20"
              }`}
            >
              {complete ? (
                <FaCheck className="text-green text-2xl" />
              ) : (
                <Loader scale={0.5} />
              )}
            </div>
          </div>
          <h1 className="mid-text text-white">
            {complete
              ? "Secure connection established"
              : "Establishing secure connection"}
          </h1>
          <p className="small-text text-dark-yellowish-white">
            {complete
              ? "Opening your isolated browser…"
              : "Spinning up your isolated browser — this usually takes ~15 seconds."}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="bg-gray h-2 w-full overflow-hidden rounded-full">
            <div
              className="bg-red h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-2 text-right">
            <span className="small-text text-dark-yellowish-white tabular-nums">
              {pct}%
            </span>
          </div>
        </div>

        {/* Steps */}
        <ul className="flex flex-col gap-3">
          {STEPS.map((label, i) => {
            const done = complete || i < step;
            const active = !complete && i === step;
            return (
              <li key={label} className="flex items-center gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                  {done ? (
                    <FaCheck className="text-green text-sm" />
                  ) : active ? (
                    <Loader scale={0.2} />
                  ) : (
                    <span className="border-dark-yellowish-white/40 h-2.5 w-2.5 rounded-full border" />
                  )}
                </span>
                <span
                  className={`normal-text transition-colors duration-300 ${
                    done
                      ? "text-dark-yellowish-white"
                      : active
                        ? "text-white"
                        : "text-dark-yellowish-white/50"
                  }`}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
