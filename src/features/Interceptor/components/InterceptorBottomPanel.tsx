import ReqResContent from "@/features/reqResPanel/components/ReqResContent";
import useProxyActions from "../hooks/useProxyActions";

export default function InterceptorBottomPanel({
  id = "",
  reqEditable = false,
  resEditable = false,
  requestText = "",
  responseText = "",
}: {
  id?: string;
  reqEditable?: boolean;
  resEditable?: boolean;
  requestText?: string;
  responseText?: string;
}) {
  const { updateInterceptedRequest, updateInterceptedResponse } =
    useProxyActions();

  return (
    <div className="flex h-full flex-col">
      {/* <Header /> */}
      {/* Div for border */}
      <div className="h-full w-full overflow-y-hidden">
        {/* Div for content */}
        <div className="mx-auto flex h-full w-11/12 items-start justify-between space-x-5">
          <div className="h-full w-1/2">
            <ReqResContent
              type="Request"
              editableProp={reqEditable}
              text={requestText}
              onBlur={(val) => updateInterceptedRequest(id, val)}
            />
          </div>
          {/* Border */}
          <div className="border-red h-full border-r" />
          <div className="h-full w-1/2">
            <ReqResContent
              type="Response"
              text={responseText}
              editableProp={resEditable}
              onBlur={(val) => updateInterceptedResponse(id, val)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
