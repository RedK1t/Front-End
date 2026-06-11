// import Header from "./components/Header";
import ReqResContent from "./components/ReqResContent";

export default function BottomPanel({
  editable = false,
  requestText = "",
  responseText = "",
  onRequestChange,
}: {
  editable?: boolean;
  requestText?: string;
  responseText?: string;
  onRequestChange?: (value: string) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* <Header /> */}
      {/* Div for border */}
      <div className="h-full w-full overflow-y-hidden">
        {/* Div for content */}
        <div className="mx-auto flex h-full w-11/12 items-start justify-between space-x-5">
          <div className="h-full w-1/2">
            <ReqResContent
              requestAndResponse={false}
              type="Request"
              editableProp={editable}
              text={requestText}
              onChange={onRequestChange}
            />
          </div>
          {/* Border */}
          <div className="border-red h-full border-r" />
          <div className="h-full w-1/2">
            <ReqResContent
              requestAndResponse={false}
              type="Response"
              text={responseText}
              editableProp={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
