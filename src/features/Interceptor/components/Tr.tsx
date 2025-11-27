import { useSearchParams } from "react-router-dom";
import checkIcon from "@/assets/CheckMarkIcon.svg";
import leftArrowIcon from "@/assets/leftArrowIcon.svg";
import rightArrowIcon from "@/assets/rightArrowIcon.svg";
import Td from "./Td";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@radix-ui/react-context-menu";
import type { ReactNode } from "react";

type TrProps = {
  index: number;
  Time: string;
  Type: string;
  Method: string;
  Direction: string;
  Host: string;
  URL: string;
  StatusCode: number;
  Length: number;
  Params: boolean;
};

export default function Tr({
  index,
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
  const [searchParams, setSearchParams] = useSearchParams();
  const isSelected = searchParams.get("selected") === index.toString();
  function handleSelect() {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("selected", index.toString());
    setSearchParams(newSearchParams);
  }
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <tr
          onClick={handleSelect}
          onContextMenu={handleSelect}
          className={`small-text ${index % 2 === 0 ? "" : "bg-yellowish-white/8"} cursor-pointer ${isSelected ? "bg-dark-red/20!" : ""}`}
        >
          <Td left={true}>{Time}</Td>
          <Td>{Type}</Td>
          <Td>{Method}</Td>
          <Td>
            {Direction === "Request" ? (
              <div className="flex items-center gap-1">
                <img src={leftArrowIcon} alt="Left Arrow" />
                <p>Request</p>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <img src={rightArrowIcon} alt="Right Arrow" />
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
        <ContextMenuItemStyled>Forward</ContextMenuItemStyled>
        <ContextMenuItemStyled>Drop</ContextMenuItemStyled>
        <div className="bg-yellowish-white! h-[0.5px]! w-full" />
        <ContextMenuItemStyled>Do Quick Scan</ContextMenuItemStyled>
        {Direction === "Request" && (
          <>
            <div className="bg-yellowish-white! h-px! w-full" />
            <ContextMenuItemStyled>
              Intercept it’s Response
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

function ContextMenuItemStyled({ children }: { children: ReactNode }) {
  return (
    <ContextMenuItem className="hover:bg-dark-red/40! rounded-6px text-yellowish-white! min-w-44 cursor-pointer px-3 py-1 focus-visible:outline-0">
      {children}
    </ContextMenuItem>
  );
}
