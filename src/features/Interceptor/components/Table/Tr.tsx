import { useSearchParams } from "react-router-dom";
import checkIcon from "@/assets/CheckMarkIcon.svg";
import leftArrowIcon from "@/assets/leftArrowIcon.svg";
import rightArrowIcon from "@/assets/rightArrowIcon.svg";
import Td from "./Td";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@radix-ui/react-context-menu";
import ContextMenuItemStyled from "@/components/ContextMenuItemStyled";
import useProxyActions from "./../../hooks/useProxyActions";
import useProxyTraffic from "../../hooks/useProxyTraffic";

type TrProps = {
  index: number;
  id: string;
  Time: string;
  Type: string;
  Method: string;
  Direction: string;
  Host: string;
  URL: string;
  StatusCode: number;
  Length: number;
  Params: boolean;
  headers: string;
  body: string;
};

export default function Tr({
  index,
  id,
  Time,
  Type,
  Method,
  Direction,
  Host,
  URL,
  StatusCode,
  Length,
  Params,
}: TrProps) {
  const {
    forwardRequest,
    forwardResponse,
    dropRequest,
    markForResponseIntercept,
    unmarkForResponseIntercept,
  } = useProxyActions();
  const {
    markedForResponseIntercept,
    interceptedRequests,
    interceptedResponses,
  } = useProxyTraffic();

  const [searchParams, setSearchParams] = useSearchParams();
  const isSelected = searchParams.get("selected") === id.toString();
  const isMarkedForResponseIntercept = markedForResponseIntercept.includes(id);
  function handleSelect() {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("selected", id.toString());
    setSearchParams(newSearchParams, { replace: true });
  }
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <tr
          onClick={handleSelect}
          onContextMenu={handleSelect}
          className={`small-text ${index % 2 === 0 ? "" : "bg-yellowish-white/8"} cursor-pointer ${isSelected ? "bg-dark-red/20!" : ""} ${isMarkedForResponseIntercept ? "border-light-red border-l-2" : ""}`}
        >
          <Td left={true}>{Time}</Td>
          <Td>{Type}</Td>
          <Td>{Method}</Td>
          <Td>
            {Direction === "Request" ? (
              <div className="flex items-center gap-1">
                <img src={rightArrowIcon} alt="right Arrow" />
                <p>Request</p>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <img src={leftArrowIcon} alt="left Arrow" />
                <p>Response</p>
              </div>
            )}
          </Td>
          <Td>{Host}</Td>
          <Td>{URL}</Td>
          <Td>{StatusCode}</Td>
          <Td>{Length}</Td>
          <Td right={true}>
            {Params ? <img src={checkIcon} alt="Check Mark" /> : ""}
          </Td>
        </tr>
      </ContextMenuTrigger>

      {/* Right Click Menu */}
      <ContextMenuContent className="bg-gray rounded-6px! small-text! text-yellowish-white! z-50! border-0! drop-shadow-lg drop-shadow-black/50">
        <ContextMenuItemStyled>{URL}</ContextMenuItemStyled>
        <div className="bg-yellowish-white! h-px! w-full" />
        <ContextMenuItemStyled
          onClick={() => {
            if (Direction === "Request") {
              const request = interceptedRequests.find((req) => req.id === id);
              const {
                id: requestId,
                method,
                url,
                headers,
                body,
              } = request || {};

              if (request) {
                forwardRequest(requestId!, method!, url!, headers!, body!);
              }
            }
            if (Direction === "Response") {
              const response = interceptedResponses.find(
                (req) => req.id === id,
              );
              const {
                id: responseId,
                status_code,
                response_headers,
                response_body,
              } = response || {};

              if (response) {
                forwardResponse(
                  responseId!,
                  response_headers!,
                  response_body!,
                  status_code!,
                );
              }
            }
          }}
        >
          Forward
        </ContextMenuItemStyled>
        <ContextMenuItemStyled onClick={() => dropRequest(id)}>
          Drop
        </ContextMenuItemStyled>
        <div className="bg-yellowish-white! h-[0.5px]! w-full" />
        <ContextMenuItemStyled>Do Quick Scan</ContextMenuItemStyled>
        {Direction === "Request" && (
          <>
            <div className="bg-yellowish-white! h-px! w-full" />
            <ContextMenuItemStyled
              onClick={() =>
                isMarkedForResponseIntercept
                  ? unmarkForResponseIntercept(id)
                  : markForResponseIntercept(id)
              }
            >
              {isMarkedForResponseIntercept ? "Unmark" : "Mark"} Intercept it’s
              Response
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
