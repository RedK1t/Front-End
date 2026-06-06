import { memo } from "react";
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

type TrProps = {
  index: number;
  isSelected: boolean;
  handleSelect: (id: string) => void;
  handleForward: (id: string, direction: string) => void;
  handleDrop: (id: string) => void;
  handleToggleMark: (id: string, isMarked: boolean) => void;
  isMarked: boolean;
  navigate: (path: string) => void;
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
  headers?: string;
  body?: string;
};

export default memo(function Tr({
  index,
  isSelected,
  handleSelect,
  handleForward,
  handleDrop,
  handleToggleMark,
  navigate,
  isMarked,
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
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <tr
          onClick={() => handleSelect(id)}
          onContextMenu={() => handleSelect(id)}
          className={`small-text ${index % 2 === 0 ? "" : "bg-yellowish-white/8"} cursor-pointer ${isSelected ? "bg-dark-red/20!" : ""} ${isMarked ? "border-light-red border-l-2" : ""}`}
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
            ) : Direction === "Response" ? (
              <div className="flex items-center gap-1">
                <img src={leftArrowIcon} alt="left Arrow" />
                <p>Response</p>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <img
                  src={rightArrowIcon}
                  alt="History"
                  className="opacity-50"
                />
                <p>History</p>
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
        {Direction !== "History" && (
          <>
            <ContextMenuItemStyled onClick={() => handleForward(id, Direction)}>
              Forward
            </ContextMenuItemStyled>
            <ContextMenuItemStyled onClick={() => handleDrop(id)}>
              Drop
            </ContextMenuItemStyled>
            <div className="bg-yellowish-white! h-[0.5px]! w-full" />
          </>
        )}
        <ContextMenuItemStyled
          onClick={() => {
            navigate(`/AiScanner?url=${URL}`);
          }}
        >
          Do Quick Scan
        </ContextMenuItemStyled>
        {Direction === "Request" && (
          <>
            <div className="bg-yellowish-white! h-px! w-full" />
            <ContextMenuItemStyled
              onClick={() => handleToggleMark(id, isMarked)}
            >
              {isMarked ? "Unmark" : "Mark"} Intercept it’s Response
            </ContextMenuItemStyled>
          </>
        )}
        <div className="bg-yellowish-white! h-px! w-full" />
        <ContextMenuItemStyled>Send to Repeater</ContextMenuItemStyled>
        <ContextMenuItemStyled>Send to Intruder</ContextMenuItemStyled>
      </ContextMenuContent>
    </ContextMenu>
  );
});
