import { FaPlug, FaRotateRight, FaCircleExclamation } from "react-icons/fa6";

interface ProxyDisconnectedProps {
  onRetry: () => void;
  isConnecting: boolean;
}

export default function ProxyDisconnected({
  onRetry,
  isConnecting,
}: ProxyDisconnectedProps) {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black p-6 transition-all duration-500">
      <div className="relative mb-8">
        <div
          className={`bg-red/10 absolute -inset-4 rounded-full blur-2xl transition-opacity duration-1000 ${isConnecting ? "animate-pulse opacity-100" : "opacity-50"}`}
        />
        <div className="border-red/20 bg-gray/50 relative flex h-24 w-24 items-center justify-center rounded-2xl border-2 shadow-2xl">
          <FaPlug
            className={`text-4xl transition-all duration-500 ${isConnecting ? "text-yellow animate-bounce" : "text-red"}`}
          />
        </div>
        <div className="bg-red absolute -top-2 -right-2 flex h-6 w-6 animate-bounce items-center justify-center rounded-full border-2 border-black shadow-lg">
          <FaCircleExclamation className="text-[10px] text-white" />
        </div>
      </div>

      <div className="max-w-md space-y-4 text-center">
        <h1 className="heading-text tracking-tight text-white">
          Connection Lost
        </h1>
        <p className="normal-text text-dark-yellowish-white leading-relaxed">
          The Interceptor proxy is currently unreachable. Make sure your backend
          service is running and try again.
        </p>
      </div>

      <div className="mt-10 flex flex-col items-center gap-4">
        <button
          onClick={onRetry}
          disabled={isConnecting}
          className={`group rounded-6px relative flex items-center gap-3 overflow-hidden px-8 py-3 transition-all active:scale-95 ${
            isConnecting
              ? "bg-gray border-yellowish-white/10 cursor-wait border"
              : "bg-red hover:bg-light-red shadow-[0_0_20px_rgba(206,50,50,0.3)] hover:shadow-[0_0_30px_rgba(206,50,50,0.5)]"
          }`}
          aria-label="Retry connection"
        >
          <FaRotateRight
            className={`text-lg text-white transition-transform duration-700 ${isConnecting ? "animate-spin" : "group-hover:rotate-180"}`}
          />
          <span className="mid-text text-white">
            {isConnecting ? "Reconnecting..." : "Try Reconnect"}
          </span>
        </button>

        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${isConnecting ? "bg-yellow animate-pulse" : "bg-red"}`}
          />
          <span className="small-text text-dark-yellowish-white tracking-widest uppercase">
            {isConnecting ? "Establishing link..." : "Disconnected"}
          </span>
        </div>
      </div>
    </div>
  );
}
