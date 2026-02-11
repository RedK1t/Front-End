import { useSearchParams } from "react-router-dom";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@radix-ui/react-context-menu";
import ContextMenuItemStyled from "@/components/ContextMenuItemStyled";
import { useState } from "react";
import useProxyActions from "@/features/Interceptor/hooks/useProxyActions";
import useProxyTraffic from "@/features/Interceptor/hooks/useProxyTraffic";

type TrProps = {
  index: number;
  children: React.ReactNode;
  isRequest?: boolean;
  id?: number;
};

export default function Tr({ index, children, isRequest, id }: TrProps) {
  const {
    forwardRequest,
    dropRequest,
    markForResponseIntercept,
    unmarkForResponseIntercept,
  } = useProxyActions();
  const { markedForResponseIntercept } = useProxyTraffic();

  const [searchParams, setSearchParams] = useSearchParams();
  const isSelected = searchParams.get("selected") === index.toString();
  function handleSelect() {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("selected", index.toString());
    setSearchParams(newSearchParams, { replace: true });
  }
  const [isIntercepted, setIsIntercepted] = useState(
    markedForResponseIntercept.includes(String(id)),
  );
  function handleInterceptResponse() {
    if (!isIntercepted) {
      markForResponseIntercept(String(id));
      setIsIntercepted(true);
    } else {
      unmarkForResponseIntercept(String(id));
      setIsIntercepted(false);
    }
  }
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <tr
          onClick={handleSelect}
          onContextMenu={handleSelect}
          className={`small-text ${index % 2 === 0 ? "" : "bg-yellowish-white/8"} cursor-pointer ${isSelected ? "bg-dark-red/20!" : ""}`}
        >
          {children}
        </tr>
      </ContextMenuTrigger>

      {/* Right Click Menu */}
      <ContextMenuContent className="bg-gray rounded-6px! small-text! text-yellowish-white! z-50! border-0! drop-shadow-lg drop-shadow-black/50">
        {/* FIXME: add url */}
        {/* <div className="bg-yellowish-white! h-px! w-full" /> */}
        {/* <ContextMenuItemStyled>{URL}</ContextMenuItemStyled> */}
        {/* FIXME: Fix Forward Request */}
        <ContextMenuItemStyled
          onClick={() => forwardRequest(String(id), "GET", "", "", "")}
        >
          Forward
        </ContextMenuItemStyled>
        <ContextMenuItemStyled onClick={() => dropRequest(String(id))}>
          Drop
        </ContextMenuItemStyled>
        <div className="bg-yellowish-white! h-[0.5px]! w-full" />
        <ContextMenuItemStyled>Do Quick Scan</ContextMenuItemStyled>
        {isRequest && (
          <>
            <div className="bg-yellowish-white! h-px! w-full" />
            <ContextMenuItemStyled onClick={handleInterceptResponse}>
              {isIntercepted
                ? "Un intercept it’s Response"
                : "Intercept it’s Response"}
            </ContextMenuItemStyled>
          </>
        )}
        <div className="bg-yellowish-white! h-px! w-full" />
        <ContextMenuItemStyled>Send to Repeater</ContextMenuItemStyled>
        <ContextMenuItemStyled>Send to Intruder</ContextMenuItemStyled>
      </ContextMenuContent>
    </ContextMenu>
  );
}
