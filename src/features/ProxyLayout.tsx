import { Outlet, useLocation } from "react-router-dom";
import useProxySocket from "./Interceptor/hooks/useProxySocket";
import ProxyDisconnected from "./Interceptor/components/ProxyDisconnected";
import { useState } from "react";

export default function ProxyLayout() {
  const { readyState } = useProxySocket();
  const location = useLocation();
  const [isRetrying, setIsRetrying] = useState(false);

  // Check if current path is NOT sitemap (or its sub-paths)
  const isNotSitemap = !location.pathname.includes("/proxy/sitemap");
  const isDisconnected = readyState !== WebSocket.OPEN;

  const handleRetry = () => {
    setIsRetrying(true);
    // The useProxySocket hook already has shouldReconnect: () => true
    // so it will attempt to reconnect automatically.
    // We just provide visual feedback for the manual retry click.
    setTimeout(() => {
      setIsRetrying(false);
    }, 2000);
  };

  // If we are disconnected AND not on the sitemap page, show the fallback
  if (isDisconnected && isNotSitemap) {
    return (
      <ProxyDisconnected
        onRetry={handleRetry}
        isConnecting={isRetrying || readyState === WebSocket.CONNECTING}
      />
    );
  }

  // Otherwise (connected OR on sitemap page), show the actual content
  return <Outlet />;
}
