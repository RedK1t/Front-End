import ReqResContent from "@/features/reqResPanel/components/ReqResContent";
import useProxyActions from "../hooks/useProxyActions";
import { useSearchParams } from "react-router-dom";
import useProxyTraffic from "../hooks/useProxyTraffic";

export default function InterceptorBottomPanel() {
  const { updateInterceptedRequest, updateInterceptedResponse } =
    useProxyActions();
  const [searchParams] = useSearchParams();
  const { interceptedRequests, interceptedResponses } = useProxyTraffic();
  const selected = searchParams.get("selected") || "";
  const selectedItemRequest = interceptedRequests.find(
    (item) => item.id === selected,
  );
  const selectedItemResponse = interceptedResponses.find(
    (item) => item.id === selected,
  );
  const request =
    selectedItemRequest?.raw || selectedItemResponse?.parent_request.raw;
  const response = selectedItemResponse?.raw_response || "";
  return (
    <div className="flex h-full flex-col">
      {/* <Header /> */}
      {/* Div for border */}
      <div className="h-full w-full overflow-y-hidden">
        {/* Div for content */}
        <div className="flex h-full w-full items-start justify-between space-x-5 pr-8 pl-14">
          <div className={`h-full ${selectedItemRequest ? "w-full" : "w-1/2"}`}>
            <ReqResContent
              type="Request"
              editableProp={selectedItemRequest ? true : false}
              text={request}
              onBlur={(val) => updateInterceptedRequest(selected, val)}
            />
          </div>
          {/* Border */}
          {selectedItemResponse && (
            <div className="border-red h-full border-r" />
          )}
          <div
            className={`h-full overflow-hidden ${selectedItemResponse ? "w-1/2" : "w-0"}`}
          >
            <ReqResContent
              type="Response"
              text={response}
              editableProp={selectedItemResponse ? true : false}
              onBlur={(val) => updateInterceptedResponse(selected, val)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
