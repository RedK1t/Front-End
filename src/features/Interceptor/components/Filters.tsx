import SwitchButton from "@/components/SwitchButton";
import interceptorOnIcon from "@/assets/interceptorOnIcon.svg";
import InterceptorHeader from "./InterceptorHeader";
import HttpHistoryHeader from "./HttpHistoryHeader";
import httpHistoryIcon from "@/assets/HttpHistoryIcon.svg";

export default function Filters() {
  return (
    <div className="flex w-full items-center">
      <InterceptorHeader />
      <HttpHistoryHeader />
      <SwitchButton
        param="Interceptor"
        imgTransform={300}
        textTransform={35}
        buttonClassName="w-32 ml-2"
        onIcon={interceptorOnIcon}
        offIcon={httpHistoryIcon}
        onText="Interceptor"
        offText="HTTP History"
      />
    </div>
  );
}
