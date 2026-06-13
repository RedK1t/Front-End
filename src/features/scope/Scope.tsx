import { useEffect } from "react";
import useProxyActions from "../Interceptor/hooks/useProxyActions";
import TargetPanel from "./components/TargetPanel";
import ExtensionsPanel from "./components/ExtensionsPanel";

export default function Scope() {
  const { getScope } = useProxyActions();

  useEffect(() => {
    getScope();
  }, [getScope]);

  return (
    <div className="mx-auto flex h-screen w-11/12 flex-col gap-8 overflow-y-auto py-7">
      <TargetPanel />
      <ExtensionsPanel />
    </div>
  );
}
