import type { intercepted_request } from "../types";
import useProxySocket from "./useProxySocket";

function useProxyActions() {
  const { sendJsonMessage } = useProxySocket();

  const toggleIntercept = (enabled: boolean) => {
    sendJsonMessage({
      action: "toggle_intercept",
      enabled,
    });
  };

  const markForResponseIntercept = (id: string) => {
    sendJsonMessage({
      action: "mark_for_response_intercept",
      id,
    });
  };

  const unmarkForResponseIntercept = (id: string) => {
    sendJsonMessage({
      action: "unmark_for_response_intercept",
      id,
    });
  };

  const forwardRequest = (
    id: string,
    method: string,
    url: string,
    headers: string,
    body: string,
  ) => {
    sendJsonMessage({
      action: "forward_request",
      id,
      request: {
        method,
        url,
        headers,
        body,
      },
    });
  };

  const forwardResponse = (
    id: string,
    headers: string,
    body: string,
    status_code: number,
  ) => {
    sendJsonMessage({
      action: "forward_response",
      id,
      response: {
        status_code,
        headers,
        body,
      },
    });
  };

  const dropRequest = (id: string) => {
    sendJsonMessage({
      action: "drop_request",
      id,
    });
  };

  const dropResponse = (id: string) => {
    sendJsonMessage({
      action: "drop_response",
      id: id,
    });
  };

  const forwardAll = (requests: intercepted_request[]) => {
    sendJsonMessage({
      action: "forward_all",
      requests,
    });
  };

  const dropAll = (ids: string[]) => {
    sendJsonMessage({
      action: "drop_all",
      ids,
    });
  };

  return {
    toggleIntercept,
    markForResponseIntercept,
    unmarkForResponseIntercept,
    forwardRequest,
    forwardResponse,
    dropRequest,
    dropResponse,
    forwardAll,
    dropAll,
  };
}

export default useProxyActions;
