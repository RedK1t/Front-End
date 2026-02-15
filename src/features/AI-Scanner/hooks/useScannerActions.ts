import useScannerSocket from "./useScannerSocket";

function useScannerActions() {
  const { sendJsonMessage } = useScannerSocket();
  // const queryClient = useQueryClient();

  const startScan = (url: string) => {
    sendJsonMessage({
      type: "start_scan",
      url: url,
    });
  };

  return { startScan };
}

export default useScannerActions;
