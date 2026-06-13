import { memo } from "react";
import checkIcon from "@/assets/CheckMarkIcon.svg";
import leftArrowIcon from "@/assets/leftArrowIcon.svg";
import rightArrowIcon from "@/assets/rightArrowIcon.svg";
import Td from "./Td";

// The row right-clicked, surfaced to the single shared context menu in Table.
export type ContextRow = {
  id: string;
  Direction: string;
  URL: string;
  isMarked: boolean;
};

type TrProps = {
  index: number;
  isSelected: boolean;
  handleSelect: (id: string) => void;
  onContextRow: (row: ContextRow) => void;
  isMarked: boolean;
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
  onContextRow,
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
    <tr
      onClick={() => handleSelect(id)}
      onContextMenu={() => {
        handleSelect(id);
        onContextRow({ id, Direction, URL, isMarked });
      }}
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
            <img src={rightArrowIcon} alt="History" className="opacity-50" />
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
  );
});
