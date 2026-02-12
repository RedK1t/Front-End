import useWebSocket from "react-use-websocket";
import type {
  mark_for_response_intercept,
  unmark_for_response_intercept,
  intercepted_request,
  intercepted_response,
  forwarded,
  dropped,
  queue_cleared,
  intercept_status,
} from "../types";

type message =
  | mark_for_response_intercept
  | unmark_for_response_intercept
  | intercepted_request
  | intercepted_response
  | forwarded
  | dropped
  | queue_cleared
  | intercept_status;

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
