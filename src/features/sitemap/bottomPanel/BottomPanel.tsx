import Header from "./components/Header";
import ReqResContent from "./components/ReqResContent";

export default function BottomPanel() {
  return (
    <div className="flex h-full flex-col">
      <Header />
      {/* Div for border */}
      <div className="border-light-red h-full w-full overflow-y-hidden border-t">
        {/* Div for content */}
        <div className="mx-auto flex h-full w-11/12 items-start justify-between">
          <ReqResContent type="Request" />
          <ReqResContent type="Response" />
        </div>
      </div>
    </div>
  );
}
