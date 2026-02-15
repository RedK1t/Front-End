import useWebSocket from "react-use-websocket";

import type { message } from "../types";

function useScannerSocket() {
  const { sendJsonMessage, lastJsonMessage, readyState } =
    useWebSocket<message>(import.meta.env.VITE_scanner_websocket_url, {
      shouldReconnect: () => true,
      share: true,
    });

  return {
    sendJsonMessage,
    lastJsonMessage,
    readyState,
  };
}

export default useScannerSocket;
