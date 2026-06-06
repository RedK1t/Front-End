import SwitchButton from "@/components/SwitchButton";
import interceptorOnIcon from "@/assets/interceptorOnIcon.svg";
import InterceptorHeader from "./InterceptorHeader";
import HttpHistoryHeader from "./HttpHistoryHeader";
import httpHistoryIcon from "@/assets/HttpHistoryIcon.svg";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import useProxyActions from "../hooks/useProxyActions";

export default function Filters() {
  const [searchParams] = useSearchParams();
  const { getHistory } = useProxyActions();
  const isHistoryMode = searchParams.get("history") === "true";

  useEffect(() => {
    if (isHistoryMode) {
      getHistory();
    }
  }, [isHistoryMode]);

  return (
    <div className="flex w-full items-center">
      <HttpHistoryHeader />
      <InterceptorHeader />
      <SwitchButton
        param="history"
        imgTransform={300}
        textTransform={35}
        buttonClassName="w-32 ml-2"
        onIcon={httpHistoryIcon}
        offIcon={interceptorOnIcon}
        onText="HTTP History"
        offText="Interceptor"
      />
    </div>
  );
}
