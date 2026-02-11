import { useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { useQueryClient } from "@tanstack/react-query";
import type {
  mark_for_response_intercept,
  unmark_for_response_intercept,
  intercepted_request,
  intercepted_response,
  forwarded,
  dropped,
  queue_cleared,
} from "../types";

type message =
  | mark_for_response_intercept
  | unmark_for_response_intercept
  | intercepted_request
  | intercepted_response
  | forwarded
  | dropped
  | queue_cleared;

function useProxySocket() {
  const queryClient = useQueryClient();

  const { sendJsonMessage, lastJsonMessage, readyState } =
    useWebSocket<message>(import.meta.env.VITE_proxy_websocket_url, {
      shouldReconnect: () => true,
      share: true,
    });

  useEffect(() => {
    if (lastJsonMessage) {
      console.log(lastJsonMessage);
      if (lastJsonMessage.type === "marked_for_response_intercept") {
        queryClient.setQueryData(
          ["marked-for-response-intercept"],
          (oldData: string[] = []) => {
            return [lastJsonMessage.id, ...oldData];
          },
        );
      }

      if (lastJsonMessage.type === "unmarked_for_response_intercept") {
        queryClient.setQueryData(
          ["marked-for-response-intercept"],
          (oldData: string[] = []) => {
            return oldData.filter((id) => id !== lastJsonMessage.id);
          },
        );
      }
      if (lastJsonMessage.type === "intercepted_request") {
        queryClient.setQueryData(
          ["intercepted_request"],
          (oldData: intercepted_request[] = []) => {
            return [lastJsonMessage, ...oldData];
          },
        );
      }
      if (lastJsonMessage.type === "intercepted_response") {
        queryClient.setQueryData(
          ["intercepted_response"],
          (oldData: intercepted_response[] = []) => {
            return [lastJsonMessage, ...oldData];
          },
        );
      }
      if (
        lastJsonMessage.type === "forwarded" ||
        lastJsonMessage.type === "dropped"
      ) {
        queryClient.setQueryData(
          ["intercepted_request"],
          (oldData: intercepted_request[] = []) => {
            return oldData.filter((item) => item.id !== lastJsonMessage.id);
          },
        );
        queryClient.setQueryData(
          ["intercepted_response"],
          (oldData: intercepted_response[] = []) => {
            return oldData.filter((item) => item.id !== lastJsonMessage.id);
          },
        );
      }
      if (lastJsonMessage.type === "queue_cleared") {
        queryClient.setQueryData(["intercepted_request"], () => {
          return [];
        });
        queryClient.setQueryData(["intercepted_response"], () => {
          return [];
        });
      }
    }
  }, [lastJsonMessage, queryClient]);

  return {
    sendJsonMessage,
    readyState,
  };
}

export default useProxySocket;
