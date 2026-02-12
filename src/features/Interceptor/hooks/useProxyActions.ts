import type { intercepted_request, intercepted_response } from "../types";
import useProxySocket from "./useProxySocket";
import { useQueryClient } from "@tanstack/react-query";

function useProxyActions() {
  const { sendJsonMessage } = useProxySocket();
  const queryClient = useQueryClient();

  const updateInterceptedRequest = (id: string, newRaw: string) => {
    // Standard HTTP: headers and body are separated by two newlines
    const [headers, ...bodyParts] = newRaw.split("\n\n");
    const body = bodyParts.join("\n\n");

    queryClient.setQueryData(
      ["intercepted_request"],
      (oldData: intercepted_request[] = []) => {
        return oldData.map((item) =>
          item.id === id ? { ...item, raw: newRaw, headers, body } : item,
        );
      },
    );
  };

  const updateInterceptedResponse = (id: string, newRaw: string) => {
    // Standard HTTP: headers and body are separated by two newlines
    const [headers, ...bodyParts] = newRaw.split("\n\n");
    const body = bodyParts.join("\n\n");

    queryClient.setQueryData(
      ["intercepted_response"],
      (oldData: intercepted_response[] = []) => {
        return oldData.map((item) =>
          item.id === id
            ? {
                ...item,
                raw_response: newRaw,
                response_headers: headers,
                response_body: body,
              }
            : item,
        );
      },
    );
  };

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
    updateInterceptedRequest,
    updateInterceptedResponse,
  };
}

export default useProxyActions;
