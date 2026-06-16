import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import useWebSocket from "react-use-websocket";
import useGetUserLocally from "@/hooks/useGetUserLocally";

// Single owner of the per-user browser session.
//
// Each user gets their own browser container (noVNC + proxy) reached only through the
// orchestrator's authenticated gateway. The proxy WebSocket URL is decided at runtime
// (it carries a signed ticket) and must NOT be persisted — a stale ticket must never
// be reused; GET /session/status returns a fresh ticketed URL on load. This context owns:
//   - the runtime proxy URL the interceptor socket connects to (null = no session),
//   - opening a session (start/restart the container),
//   - auto-reconnecting to an already-running session on load (GET /session/status),
//   - the keep-alive heartbeat (so the container isn't idle-stopped while in use),
//   - the connection PHASE + progress driving the "establishing connection" screen.
//
// Why a phase machine: `/session/open` returns once the container has *started*, but its
// proxy (port 5050) isn't reachable for ~10-15s (entrypoint sleeps, then boots VNC +
// mitmproxy). Connecting the WebSocket immediately just fails and looks "disconnected".
// Instead we poll GET /session/status (which now reports `ready` via a real TCP probe) and
// only set proxyWsUrl — i.e. connect the socket — once the proxy actually accepts traffic.

const ORCHESTRATOR_URL = import.meta.env.VITE_orchestrator_REST_url as string;
const HEARTBEAT_MS = 60_000;

// Force noVNC's "Remote Resizing" scaling mode (resize=remote) so the Kali
// desktop resizes to fit the viewer. Applied to the viewer URL before it's used,
// preserving any existing ticket/query params and hash.
function withRemoteResize(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    url.searchParams.set("resize", "remote");
    return url.toString();
  } catch {
    if (/[?&]resize=/.test(rawUrl)) return rawUrl;
    const [base, hash = ""] = rawUrl.split("#");
    const sep = base.includes("?") ? "&" : "?";
    return `${base}${sep}resize=remote${hash ? `#${hash}` : ""}`;
  }
}

const POLL_MS = 1_000;
const READY_TIMEOUT_MS = 40_000;

/**
 * idle      → no session (gate offers "Open Browser")
 * opening   → POST /session/open in flight
 * waiting   → container started, polling until its proxy is reachable
 * ready     → proxy reachable; proxyWsUrl set, interceptor WS connecting
 * connected → interceptor WS is OPEN (set by ProxyLayout from readyState)
 * dropped   → WS closed after having connected (set by ProxyLayout)
 * error     → open failed, or readiness timed out
 */
export type ConnectionPhase =
  | "idle"
  | "opening"
  | "waiting"
  | "ready"
  | "connected"
  | "dropped"
  | "error";

interface StatusResponse {
  running: boolean;
  ready?: boolean;
  proxyWsUrl?: string;
  vncUrl?: string;
}

interface ProxySessionContextType {
  /** null until a session exists (gateway ticketed URL); never persisted. */
  proxyWsUrl: string | null;
  setProxyWsUrl: (url: string) => void;
  openBrowser: () => Promise<void>;
  isOpening: boolean;
  error: string | null;
  /** True while the initial GET /session/status check is in flight. */
  isCheckingSession: boolean;
  /** Where we are in bringing the session online (drives the progress screen). */
  connectionPhase: ConnectionPhase;
  setConnectionPhase: (phase: ConnectionPhase) => void;
  /** 0-100 progress estimate for the connection screen. */
  progress: number;
  /** noVNC viewer URL (ticketed) once a session is ready; null otherwise. */
  vncUrl: string | null;
  /** Open the noVNC viewer in a new tab (call from a click — gesture-safe). */
  openViewer: () => void;
  /** True when an automatic viewer open was blocked by the popup blocker. */
  viewerBlocked: boolean;
}

const ProxySessionContext = createContext<ProxySessionContextType | undefined>(
  undefined,
);

export const ProxySessionProvider = ({ children }: { children: ReactNode }) => {
  const auth = useGetUserLocally();
  const token = auth?.access_token;

  const [proxyWsUrl, setProxyWsUrlState] = useState<string | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(false);
  const [connectionPhase, setConnectionPhase] = useState<ConnectionPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [vncUrl, setVncUrl] = useState<string | null>(null);
  const [viewerBlocked, setViewerBlocked] = useState(false);

  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Only auto-open the viewer for an explicit open (not a silent reload reconnect).
  const shouldAutoOpenViewerRef = useRef(false);

  // Hold the interceptor WebSocket open at the provider level. This provider never unmounts
  // during navigation, so the shared (share:true) connection's refcount never drops to 0 and
  // the socket stays OPEN when leaving/returning to /proxy. Without this, every /proxy
  // subscriber unmounts on navigation, the socket closes, and returning briefly shows
  // "No Active Browser Session" while it reconnects. Safe: interception is DB-driven in the
  // proxy backend, so an always-open notification socket changes nothing about interception.
  useWebSocket(proxyWsUrl, { share: true, shouldReconnect: () => true });

  // Not persisted on purpose: the URL embeds a signed ticket that must stay fresh.
  const setProxyWsUrl = useCallback((url: string) => {
    setProxyWsUrlState(url);
  }, []);

  // Best-effort auto-open of the viewer once the session is ready. We intentionally omit
  // `noopener` here so a blocked popup is observable (window.open returns null) — the URL is
  // our own trusted gateway. When blocked, surface a toast and let the header button (a real
  // click, always allowed) open it instead.
  const tryOpenViewer = useCallback((url: string) => {
    const win = window.open(url, "_blank");
    if (!win) {
      setViewerBlocked(true);
      toast("Browser ready — click “Open Browser Window” to view it.", {
        icon: "🌐",
      });
    } else {
      setViewerBlocked(false);
    }
  }, []);

  // Explicit, click-driven viewer open (gesture-safe — never blocked).
  const openViewer = useCallback(() => {
    if (!vncUrl) return;
    window.open(vncUrl, "_blank");
    setViewerBlocked(false);
  }, [vncUrl]);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  }, []);

  const startHeartbeat = useCallback(() => {
    stopHeartbeat();
    if (!token) return;
    heartbeatRef.current = setInterval(() => {
      fetch(`${ORCHESTRATOR_URL}/session/heartbeat`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {
        /* transient errors are non-fatal; the next tick retries */
      });
    }, HEARTBEAT_MS);
  }, [token, stopHeartbeat]);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
  }, []);

  // One readiness check. When the proxy is reachable, connect the WS (set the URL) and
  // hand keep-alive to the heartbeat. Transient failures are ignored — the poll retries.
  const checkReadyOnce = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${ORCHESTRATOR_URL}/session/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data: StatusResponse = await res.json();
      if (data && data.running && data.ready && data.proxyWsUrl) {
        stopPolling();
        setProxyWsUrl(data.proxyWsUrl);
        setConnectionPhase("ready");
        startHeartbeat();
        if (data.vncUrl) {
          const vnc = withRemoteResize(data.vncUrl);
          setVncUrl(vnc);
          // Open the viewer now that the container is actually reachable (only for an
          // explicit open — not a silent reload reconnect).
          if (shouldAutoOpenViewerRef.current) {
            shouldAutoOpenViewerRef.current = false;
            tryOpenViewer(vnc);
          }
        }
      }
    } catch {
      /* transient — keep polling until ready or the timeout fires */
    }
  }, [token, stopPolling, setProxyWsUrl, startHeartbeat, tryOpenViewer]);

  // Poll /session/status until the container's proxy accepts connections (or we time out).
  const startPolling = useCallback(() => {
    stopPolling();
    setConnectionPhase("waiting");
    void checkReadyOnce();
    pollRef.current = setInterval(() => {
      void checkReadyOnce();
    }, POLL_MS);
    pollTimeoutRef.current = setTimeout(() => {
      stopPolling();
      setConnectionPhase("error");
      setError(
        "Timed out waiting for the browser session to come online. Please try again.",
      );
    }, READY_TIMEOUT_MS);
  }, [stopPolling, checkReadyOnce]);

  // Explicit user action: start (or restart) the container, then wait for it to be ready.
  const openBrowser = useCallback(async () => {
    if (!token) {
      setError("You must be signed in to open a browser session.");
      return;
    }
    setIsOpening(true);
    setError(null);
    setProgress(0);
    setViewerBlocked(false);
    setConnectionPhase("opening");
    // Auto-open the viewer once this session becomes reachable (see checkReadyOnce).
    shouldAutoOpenViewerRef.current = true;
    try {
      const res = await fetch(`${ORCHESTRATOR_URL}/session/open`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(`orchestrator responded ${res.status}`);
      }
      // Don't open the viewer or connect the WS yet — poll until the proxy is actually
      // reachable, then open the tab so it never lands on a "bad request" page.
      startPolling();
    } catch (err) {
      console.error("[proxy-session] open failed:", err);
      setConnectionPhase("error");
      setError("Failed to open browser session. Is the orchestrator running?");
    } finally {
      setIsOpening(false);
    }
  }, [token, startPolling]);

  // Smoothly creep the progress bar toward a per-phase cap so it animates between the
  // 1s readiness polls instead of jumping. ProxyLayout flips the phase to "connected"
  // (→100%) the moment the WebSocket opens.
  useEffect(() => {
    if (connectionPhase === "idle" || connectionPhase === "dropped") {
      setProgress(0);
      return;
    }
    if (connectionPhase === "connected") {
      setProgress(100);
      return;
    }
    if (connectionPhase === "error") return; // hold wherever it stalled
    const cap =
      connectionPhase === "opening" ? 15 : connectionPhase === "waiting" ? 85 : 96;
    const id = setInterval(() => {
      setProgress((p) => (p < cap ? p + Math.max(0.5, (cap - p) * 0.06) : p));
    }, 150);
    return () => clearInterval(id);
  }, [connectionPhase]);

  // On load: reconnect to an already-running session (no viewer popup). If it's running
  // but not ready yet (e.g. just restarted), fall into the progress/poll path.
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setIsCheckingSession(true);
    fetch(`${ORCHESTRATOR_URL}/session/status`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: StatusResponse | null) => {
        if (cancelled || !data || !data.running) return;
        if (data.ready && data.proxyWsUrl) {
          setProxyWsUrl(data.proxyWsUrl);
          setConnectionPhase("ready");
          startHeartbeat();
          // Silent reconnect on reload: keep the viewer URL for the header button,
          // but do NOT auto-open a tab the user didn't ask for.
          if (data.vncUrl) setVncUrl(withRemoteResize(data.vncUrl));
        } else {
          setProgress(0);
          startPolling();
        }
      })
      .catch(() => {
        /* no orchestrator / no session — the gate will offer Open Browser */
      })
      .finally(() => {
        if (!cancelled) setIsCheckingSession(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token, setProxyWsUrl, startHeartbeat, startPolling]);

  // Tear down timers if the provider ever unmounts (app close).
  useEffect(
    () => () => {
      stopHeartbeat();
      stopPolling();
    },
    [stopHeartbeat, stopPolling],
  );

  return (
    <ProxySessionContext.Provider
      value={{
        proxyWsUrl,
        setProxyWsUrl,
        openBrowser,
        isOpening,
        error,
        isCheckingSession,
        connectionPhase,
        setConnectionPhase,
        progress,
        vncUrl,
        openViewer,
        viewerBlocked,
      }}
    >
      {children}
    </ProxySessionContext.Provider>
  );
};

export const useProxySession = () => {
  const context = useContext(ProxySessionContext);
  if (!context) {
    throw new Error(
      "useProxySession must be used within a ProxySessionProvider",
    );
  }
  return context;
};
