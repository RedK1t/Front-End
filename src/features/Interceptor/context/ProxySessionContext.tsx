import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
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
//   - the keep-alive heartbeat (so the container isn't idle-stopped while in use).
// Keeping it here means the gate screen and the header share ONE session + ONE
// heartbeat instead of fighting over two hook instances.

const ORCHESTRATOR_URL = import.meta.env.VITE_orchestrator_REST_url as string;
const HEARTBEAT_MS = 60_000;

interface OpenSessionResponse {
  userId: string;
  vncUrl: string;
  proxyWsUrl: string;
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

  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Not persisted on purpose: the URL embeds a signed ticket that must stay fresh.
  const setProxyWsUrl = useCallback((url: string) => {
    setProxyWsUrlState(url);
  }, []);

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

  // Explicit user action: start (or restart) the container and open its viewer.
  const openBrowser = useCallback(async () => {
    if (!token) {
      setError("You must be signed in to open a browser session.");
      return;
    }
    setIsOpening(true);
    setError(null);
    try {
      const res = await fetch(`${ORCHESTRATOR_URL}/session/open`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error(`orchestrator responded ${res.status}`);
      }
      const data: OpenSessionResponse = await res.json();
      setProxyWsUrl(data.proxyWsUrl);
      window.open(data.vncUrl, "_blank", "noopener,noreferrer");
      startHeartbeat();
    } catch (err) {
      console.error("[proxy-session] open failed:", err);
      setError("Failed to open browser session. Is the orchestrator running?");
    } finally {
      setIsOpening(false);
    }
  }, [token, setProxyWsUrl, startHeartbeat]);

  // On load: silently reconnect to an already-running session (no viewer popup).
  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setIsCheckingSession(true);
    fetch(`${ORCHESTRATOR_URL}/session/status`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data || !data.running || !data.proxyWsUrl) return;
        setProxyWsUrl(data.proxyWsUrl);
        startHeartbeat();
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
  }, [token, setProxyWsUrl, startHeartbeat]);

  // Tear down the heartbeat if the provider ever unmounts (app close).
  useEffect(() => stopHeartbeat, [stopHeartbeat]);

  return (
    <ProxySessionContext.Provider
      value={{
        proxyWsUrl,
        setProxyWsUrl,
        openBrowser,
        isOpening,
        error,
        isCheckingSession,
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
