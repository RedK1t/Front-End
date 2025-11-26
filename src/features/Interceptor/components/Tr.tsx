import { useSearchParams } from "react-router-dom";
import checkIcon from "@/assets/CheckMarkIcon.svg";
import leftArrowIcon from "@/assets/LeftArrowIcon.svg";
import rightArrowIcon from "@/assets/RightArrowIcon.svg";
import Td from "./Td";

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
    <tr
      onClick={handleSelect}
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
  );
}
