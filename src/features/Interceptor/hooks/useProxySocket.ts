import useWebSocket from "react-use-websocket";
import type { message } from "../types";
import { useProxySession } from "../context/ProxySessionContext";

function useProxySocket() {
  // Connect to the current user's browser-container proxy. The URL is decided
  // at runtime (a gateway URL carrying a signed ticket, set when the session opens);
  // react-use-websocket re-keys/reconnects when it changes. A null URL means no
  // session yet, so we pass null and it does not attempt to connect.
  const { proxyWsUrl } = useProxySession();

  const { sendJsonMessage, lastJsonMessage, readyState } =
    useWebSocket<message>(proxyWsUrl, {
      shouldReconnect: () => true,
      share: true,
    });

  return {
    sendJsonMessage,
    lastJsonMessage,
    readyState,
  };
}

export default useProxySocket;
