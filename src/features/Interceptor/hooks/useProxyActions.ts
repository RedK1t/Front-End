import type { intercepted_request, intercepted_response } from "../types";
import useProxySocket from "./useProxySocket";
import { useQueryClient } from "@tanstack/react-query";

function useProxyActions() {
  const { sendJsonMessage } = useProxySocket();
  const queryClient = useQueryClient();

  const updateInterceptedRequest = (id: string, newRaw: string) => {
    queryClient.setQueryData(
      ["intercepted_request"],
      (oldData: intercepted_request[] = []) => {
        return oldData.map((item) =>
          item.id === id ? { ...item, raw: newRaw } : item,
        );
      },
    );
  };

  const updateInterceptedResponse = (id: string, newRaw: string) => {
    queryClient.setQueryData(
      ["intercepted_response"],
      (oldData: intercepted_response[] = []) => {
        return oldData.map((item) =>
          item.id === id
            ? {
                ...item,
                raw_response: newRaw,
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

  const forwardRequest = (id: string, request: string) => {
    sendJsonMessage({
      action: "forward_request",
      id,
      request,
    });
  };

  const forwardResponse = (id: string, response: string) => {
    sendJsonMessage({
      action: "forward_response",
      id,
      response,
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

  const forwardAll = (items: { id: string; type: string; raw: string }[]) => {
    sendJsonMessage({
      action: "forward_all",
      items,
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
