import { useSearchParams } from "react-router-dom";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@radix-ui/react-context-menu";
import ContextMenuItemStyled from "@/components/ContextMenuItemStyled";

type TrProps = {
  index: number;
  children: React.ReactNode;
};

export default function Tr({ index, children }: TrProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const isSelected = searchParams.get("selected") === index.toString();
  function handleSelect() {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("selected", index.toString());
    setSearchParams(newSearchParams, { replace: true });
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
        {/* <ContextMenuItemStyled>{URL}</ContextMenuItemStyled> */}
        <div className="bg-yellowish-white! h-px! w-full" />
        <ContextMenuItemStyled>Forward</ContextMenuItemStyled>
        <ContextMenuItemStyled>Drop</ContextMenuItemStyled>
        <div className="bg-yellowish-white! h-[0.5px]! w-full" />
        <ContextMenuItemStyled>Do Quick Scan</ContextMenuItemStyled>
        {/* FIXME: add url */}
        {/* {Direction === "Request" && (
          <>
            <div className="bg-yellowish-white! h-px! w-full" />
            <ContextMenuItemStyled>
              Intercept it’s Response
            </ContextMenuItemStyled>
          </>
        )} */}
        <div className="bg-yellowish-white! h-px! w-full" />
        <ContextMenuItemStyled>Send to Intruder</ContextMenuItemStyled>
      </ContextMenuContent>
    </ContextMenu>
  );
}
