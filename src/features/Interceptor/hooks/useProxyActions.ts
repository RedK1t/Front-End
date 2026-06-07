import type { intercepted_request, intercepted_response } from "../types";
import useProxySocket from "./useProxySocket";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

function useProxyActions() {
  const { sendJsonMessage } = useProxySocket();
  const queryClient = useQueryClient();

  const updateInterceptedRequest = useCallback(
    (id: string, newRaw: string) => {
      queryClient.setQueryData(
        ["intercepted_request"],
        (oldData: intercepted_request[] = []) => {
          return oldData.map((item) =>
            item.id === id ? { ...item, raw: newRaw } : item,
          );
        },
      );
    },
    [queryClient],
  );

  const updateInterceptedResponse = useCallback(
    (id: string, newRaw: string) => {
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
    },
    [queryClient],
  );

  const toggleIntercept = useCallback(
    (enabled: boolean) => {
      sendJsonMessage({
        action: "toggle_intercept",
        enabled,
      });
    },
    [sendJsonMessage],
  );

  const markForResponseIntercept = useCallback(
    (id: string) => {
      sendJsonMessage({
        action: "mark_for_response_intercept",
        id,
      });
    },
    [sendJsonMessage],
  );

  const unmarkForResponseIntercept = useCallback(
    (id: string) => {
      sendJsonMessage({
        action: "unmark_for_response_intercept",
        id,
      });
    },
    [sendJsonMessage],
  );

  const forwardRequest = useCallback(
    (id: string, request: string) => {
      sendJsonMessage({
        action: "forward_request",
        id,
        request,
      });
    },
    [sendJsonMessage],
  );

  const forwardResponse = useCallback(
    (id: string, response: string) => {
      sendJsonMessage({
        action: "forward_response",
        id,
        response,
      });
    },
    [sendJsonMessage],
  );

  const dropRequest = useCallback(
    (id: string) => {
      sendJsonMessage({
        action: "drop_request",
        id,
      });
    },
    [sendJsonMessage],
  );

  const dropResponse = useCallback(
    (id: string) => {
      sendJsonMessage({
        action: "drop_response",
        id: id,
      });
    },
    [sendJsonMessage],
  );

  const forwardAll = useCallback(
    (items: { id: string; type: string; raw: string }[]) => {
      sendJsonMessage({
        action: "forward_all",
        items,
      });
    },
    [sendJsonMessage],
  );

  const dropAll = useCallback(
    (ids: string[]) => {
      sendJsonMessage({
        action: "drop_all",
        ids,
      });
    },
    [sendJsonMessage],
  );

  const getHistory = useCallback(() => {
    sendJsonMessage({
      action: "get_history",
    });
  }, [sendJsonMessage]);

  const getHistoryDetail = useCallback(
    (id: string) => {
      sendJsonMessage({
        action: "get_history_detail",
        id: Number(id),
      });
    },
    [sendJsonMessage],
  );

  const clearHistory = useCallback(() => {
    sendJsonMessage({
      action: "clear_history",
    });
  }, [sendJsonMessage]);

  const startIntruderAttack = useCallback(
    (data: {
      raw: string;
      attack_type: string;
      payload_sets: string[][];
      target?: string;
      grep?: string;
      threads?: number;
      timeout?: number;
      follow_redirects?: boolean;
    }) => {
      sendJsonMessage({
        action: "intruder_attack",
        ...data,
      });
    },
    [sendJsonMessage],
  );

  const stopIntruderAttack = useCallback(() => {
    sendJsonMessage({
      action: "intruder_stop",
    });
  }, [sendJsonMessage]);

  const getIntruderResponse = useCallback(
    (index: number) => {
      sendJsonMessage({
        action: "intruder_get_response",
        index,
      });
    },
    [sendJsonMessage],
  );

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
    getHistory,
    getHistoryDetail,
    clearHistory,
    startIntruderAttack,
    stopIntruderAttack,
    getIntruderResponse,
  };
}

export default useProxyActions;
