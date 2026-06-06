import useWebSocket from "react-use-websocket";
import type { message } from "../types";

function useProxySocket() {
  const { sendJsonMessage, lastJsonMessage, readyState } =
    useWebSocket<message>(import.meta.env.VITE_proxy_websocket_url, {
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
