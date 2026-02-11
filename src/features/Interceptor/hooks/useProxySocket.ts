import { useEffect } from "react";
import useWebSocket from "react-use-websocket";
function useProxySocket() {
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    import.meta.env.VITE_proxy_websocket_url,
    {
      shouldReconnect: () => true, // Automatically reconnect if it drops
    },
  );
  useEffect(() => {
    if (readyState === 1) {
      console.log("connected");
    }
    if (lastJsonMessage) {
      console.log(lastJsonMessage);
    }
  }, [readyState, lastJsonMessage]);
  return {
    sendJsonMessage,
    lastJsonMessage,
    readyState,
  };
}

export default useProxySocket;
