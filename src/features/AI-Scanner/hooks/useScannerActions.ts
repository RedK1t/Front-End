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

  // Scan a full captured request so POST body params (and any method) get tested.
  // `url` is included so the backend can reliably resolve the absolute scheme/host.
  const startRawScan = ({
    rawRequest,
    url,
  }: {
    rawRequest: string;
    url?: string;
  }) => {
    sendJsonMessage({
      type: "start_scan",
      raw_request: rawRequest,
      url,
    });
  };

  return { startScan, startRawScan };
}

export default useScannerActions;
