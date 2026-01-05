// import Header from "./components/Header";
import ReqResContent from "./components/ReqResContent";

export default function BottomPanel({
  editable = false,
  requestText = "",
  responseText = "",
}: {
  editable?: boolean;
  requestText?: string;
  responseText?: string;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* <Header /> */}
      {/* Div for border */}
      <div className="h-full w-full overflow-y-hidden">
        {/* Div for content */}
        <div className="mx-auto flex h-full w-11/12 items-start justify-between">
          <ReqResContent
            type="Request"
            editableProp={editable}
            text={requestText}
          />
          <ReqResContent
            type="Response"
            text={responseText}
            editableProp={editable}
          />
        </div>
      </div>
    </div>
  );
}
