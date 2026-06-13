import { Outlet, useLocation } from "react-router-dom";
import useProxySocket from "./Interceptor/hooks/useProxySocket";
import ProxyDisconnected from "./Interceptor/components/ProxyDisconnected";
import { useEffect, useState } from "react";
import ProxyCacheManager from "./Interceptor/hooks/ProxyCacheManager";
import { useProxySession } from "./Interceptor/context/ProxySessionContext";
import useAutoAddScope from "./Interceptor/hooks/useAutoAddScope";

export default function ProxyLayout() {
  const { readyState } = useProxySocket();
  const { openBrowser, isOpening, isCheckingSession } = useProxySession();
  // Auto-add the current working domain to the Target Scope (Include).
  useAutoAddScope();
  const location = useLocation();
  const [isRetrying, setIsRetrying] = useState(false);
  // Track whether the proxy has ever connected so we can tell "no session yet"
  // (per-user container not started) apart from a genuinely dropped connection.
  const [hasConnected, setHasConnected] = useState(false);

  // Check if current path is NOT sitemap (or its sub-paths)
  const isNotSitemap = !location.pathname.includes("/proxy/sitemap");
  const isConnected = readyState === WebSocket.OPEN;
  const isDisconnected = !isConnected;

  useEffect(() => {
    if (isConnected) setHasConnected(true);
  }, [isConnected]);

  const handleRetry = () => {
    setIsRetrying(true);
    // The useProxySocket hook already has shouldReconnect: () => true
    // so it will attempt to reconnect automatically.
    // We just provide visual feedback for the manual retry click.
    setTimeout(() => {
      setIsRetrying(false);
    }, 2000);
  };

  // If we are disconnected AND not on the sitemap page, show the fallback.
  // The fallback now offers "Open Browser" so the user can start their container
  // (without it, this screen would hide the only button that fixes it).
  if (isDisconnected && isNotSitemap) {
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

  // Otherwise (connected OR on sitemap page), show the actual content
  return (
    <>
      <ProxyCacheManager />
      <Outlet />
    </>
  );
}
