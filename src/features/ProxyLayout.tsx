import { useLocation } from "react-router-dom";
import AnimatedOutlet from "@/components/AnimatedOutlet";
import useProxySocket from "./Interceptor/hooks/useProxySocket";
import ProxyDisconnected from "./Interceptor/components/ProxyDisconnected";
import ProxyConnecting from "./Interceptor/components/ProxyConnecting";
import { useEffect, useRef, useState } from "react";
import ProxyCacheManager from "./Interceptor/hooks/ProxyCacheManager";
import { useProxySession } from "./Interceptor/context/ProxySessionContext";
import useAutoAddScope from "./Interceptor/hooks/useAutoAddScope";

export default function ProxyLayout() {
  const { readyState } = useProxySocket();
  const {
    openBrowser,
    isOpening,
    isCheckingSession,
    connectionPhase,
    setConnectionPhase,
    progress,
  } = useProxySession();
  // Auto-add the current working domain to the Target Scope (Include).
  useAutoAddScope();
  const location = useLocation();
  const [isRetrying, setIsRetrying] = useState(false);
  // Track whether the proxy has ever connected so we can tell "no session yet"
  // (per-user container not started) apart from a genuinely dropped connection.
  const [hasConnected, setHasConnected] = useState(false);
  // Brief hold after the socket opens so the connection card can show every step
  // completed (and fade out) before we reveal the page.
  const [revealContent, setRevealContent] = useState(false);
  // Guard so React 18 StrictMode's double-mount doesn't fire auto-start twice.
  const autoStartedRef = useRef(false);
  // Guard so we only auto-restart once per drop (avoid an open/fail/open loop).
  const autoRecoverRef = useRef(false);
  // Grace timer before treating a non-OPEN socket as a genuine drop (avoids flashing the
  // disconnected card during a transient reconnect, e.g. right after navigating back).
  const dropTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check if current path is NOT sitemap (or its sub-paths)
  const isNotSitemap = !location.pathname.includes("/proxy/sitemap");
  const isConnected = readyState === WebSocket.OPEN;

  // Auto-start the session when the user enters the Proxy section with no session yet,
  // so they land on the progress screen instead of a "No connection" card. Fires once
  // the initial /session/status check has settled and we're still idle.
  useEffect(() => {
    if (autoStartedRef.current) return;
    if (!isCheckingSession && connectionPhase === "idle") {
      autoStartedRef.current = true;
      void openBrowser();
    }
  }, [isCheckingSession, connectionPhase, openBrowser]);

  // Keep the session phase in sync with the actual socket: OPEN → connected immediately;
  // a close *after* having connected → dropped, but only after a short grace period so a
  // transient reconnect (e.g. navigating back) doesn't flash the disconnected card.
  useEffect(() => {
    if (isConnected) {
      if (dropTimerRef.current) {
        clearTimeout(dropTimerRef.current);
        dropTimerRef.current = null;
      }
      setHasConnected(true);
      autoRecoverRef.current = false;
      if (connectionPhase !== "connected") setConnectionPhase("connected");
    } else if (connectionPhase === "connected" && !dropTimerRef.current) {
      dropTimerRef.current = setTimeout(() => {
        dropTimerRef.current = null;
        setConnectionPhase("dropped");
      }, 2500);
    }
    return () => {
      if (dropTimerRef.current) {
        clearTimeout(dropTimerRef.current);
        dropTimerRef.current = null;
      }
    };
  }, [isConnected, connectionPhase, setConnectionPhase]);

  // Hold the completed connection card briefly (so all steps check off and fade) before
  // revealing the page. Reset when the socket isn't open so the next connect re-animates.
  useEffect(() => {
    if (!isConnected) {
      setRevealContent(false);
      return;
    }
    const t = setTimeout(() => setRevealContent(true), 900);
    return () => clearTimeout(t);
  }, [isConnected]);

  // The container is idle-stopped after a while; if our socket dropped because of that,
  // transparently restart it (POST /session/open) instead of forcing a manual click.
  useEffect(() => {
    if (connectionPhase === "dropped" && !autoRecoverRef.current) {
      autoRecoverRef.current = true;
      void openBrowser();
    }
  }, [connectionPhase, openBrowser]);

  const handleRetry = () => {
    setIsRetrying(true);
    // The useProxySocket hook already has shouldReconnect: () => true
    // so it will attempt to reconnect automatically.
    // We just provide visual feedback for the manual retry click.
    setTimeout(() => {
      setIsRetrying(false);
    }, 2000);
  };

  // Connected AND the completion card has finished (or on the sitemap page, which works
  // without the proxy) → show content.
  const showContent = (isConnected && revealContent) || !isNotSitemap;
  if (showContent) {
    // Key by the proxy sub-route (interceptor / intruder / scope / sitemap …)
    // so sitemap's own standard↔hierarchical toggle doesn't remount the page.
    const subSegment = location.pathname.split("/")[2] || "proxy";
    return (
      <>
        <ProxyCacheManager />
        <AnimatedOutlet transitionKey={subSegment} />
      </>
    );
  }

  // Genuine problem states → offer Open Browser / retry. Everything else (idle while the
  // initial status check / auto-start is in flight, opening, waiting, ready) shows the
  // staged progress screen, so the user never flashes past a "No connection" card.
  // "dropped" is handled by the transparent auto-restart above, so only a hard error
  // surfaces the manual reconnect card.
  const needsAttention = connectionPhase === "error";
  if (needsAttention) {
    return (
      <>
        <ProxyCacheManager />
        <ProxyDisconnected
          onRetry={handleRetry}
          isConnecting={
            isRetrying ||
            isCheckingSession ||
            readyState === WebSocket.CONNECTING
          }
          onOpenBrowser={openBrowser}
          isOpening={isOpening}
          neverConnected={!hasConnected}
        />
      </>
    );
  }

  return (
    <>
      <ProxyCacheManager />
      <ProxyConnecting phase={connectionPhase} progress={progress} />
    </>
  );
}
