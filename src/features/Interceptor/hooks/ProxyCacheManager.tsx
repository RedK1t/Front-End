import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useProxySocket from "./useProxySocket";
import type {
  history_item,
  intercepted_request,
  intercepted_response,
  message,
} from "../types";

export default function ProxyCacheManager() {
  const { lastJsonMessage } = useProxySocket();
  const queryClient = useQueryClient();

  // Ref to track the last processed message to prevent double-processing
  const lastProcessedRef = useRef<message>(null);

  useEffect(() => {
    if (lastJsonMessage && lastJsonMessage !== lastProcessedRef.current) {
      lastProcessedRef.current = lastJsonMessage;
      console.log(lastProcessedRef.current);

      const type = lastJsonMessage.type;

      if (type === "intercept_status") {
        queryClient.setQueryData(["intercept_status"], lastJsonMessage.enabled);
      }

      if (type === "marked_for_response_intercept") {
        queryClient.setQueryData(
          ["marked-for-response-intercept"],
          (oldData: string[] = []) => {
            if (oldData.includes(lastJsonMessage.id)) return oldData;
            return [lastJsonMessage.id, ...oldData];
          },
        );
      }

      if (type === "unmarked_for_response_intercept") {
        queryClient.setQueryData(
          ["marked-for-response-intercept"],
          (oldData: string[] = []) => {
            return oldData.filter((id) => id !== lastJsonMessage.id);
          },
        );
      }

      if (type === "intercepted_request") {
        const time =
          new Date().toLocaleTimeString("en-GB", { hour12: false }) +
          " " +
          new Date().toLocaleDateString("en-GB").split("/").reverse().join("-");

        queryClient.setQueryData(
          ["intercepted_request"],
          (oldData: intercepted_request[] = []) => {
            if (oldData.some((item) => item.id === lastJsonMessage.id))
              return oldData;
            return [{ ...lastJsonMessage, Time: time }, ...oldData];
          },
        );
      }

      if (type === "intercepted_response") {
        const time =
          new Date().toLocaleTimeString("en-GB", { hour12: false }) +
          " " +
          new Date().toLocaleDateString("en-GB").split("/").reverse().join("-");

        queryClient.setQueryData(
          ["intercepted_response"],
          (oldData: intercepted_response[] = []) => {
            if (oldData.some((item) => item.id === lastJsonMessage.id))
              return oldData;
            return [{ ...lastJsonMessage, Time: time }, ...oldData];
          },
        );
      }

      if (type === "forwarded" || type === "dropped") {
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

      if (type === "queue_cleared") {
        queryClient.setQueryData(["intercepted_request"], () => []);
        queryClient.setQueryData(["intercepted_response"], () => []);
      }

      if (type === "history") {
        queryClient.setQueryData(["history"], () => lastJsonMessage.data);
      }

      if (type === "history_new") {
        queryClient.setQueryData(
          ["history"],
          (oldData: history_item[] = []) => {
            if (oldData.some((item) => item.id === lastJsonMessage.row.id))
              return oldData;
            return [lastJsonMessage.row, ...oldData];
          },
        );
      }

      if (type === "history_detail") {
        queryClient.setQueryData(["history_detail"], () => lastJsonMessage);
      }

      if (type === "history_cleared") {
        queryClient.setQueryData(["history"], () => []);
        queryClient.setQueryData(["history_detail"], () => null);
      }
    }
  }, [lastJsonMessage, queryClient]);

  return null;
}
