import { useEffect } from "react";
import useProxyActions from "../Interceptor/hooks/useProxyActions";
import TargetPanel from "./components/TargetPanel";

export default function Scope() {
  const { getScope } = useProxyActions();

  useEffect(() => {
    getScope();
  }, [getScope]);

  return (
    <div className="mx-auto flex h-screen w-11/12 flex-col items-center justify-center py-7 lg:max-h-screen">
      <TargetPanel />
    </div>
  );
}
