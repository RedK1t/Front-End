import BottomPanel from "./../reqResPanel/BottomPanel";
import TabsList from "./components/TabsList";
import HeaderLeftPart from "./components/HeaderLeftPart";
import HeaderRightPart from "./components/HeaderRightPart";
import { useState } from "react";

export default function Repeater() {
  const [isExtended, setIsExtended] = useState(false);
  return (
    <div className="flex h-screen w-full flex-col">
      <div
        className={`border-light-red transition-all duration-1000 ease-in-out ${isExtended ? "h-full" : "h-[7%]"} flex max-h-fit w-full items-center justify-between gap-1.5 border-b px-2 py-1`}
      >
        <HeaderLeftPart />
        <TabsList isExtended={isExtended} />
        <HeaderRightPart
          isExtended={isExtended}
          setIsExtended={setIsExtended}
        />
      </div>
      <div className="h-full">
        <BottomPanel />
      </div>
    </div>
  );
}
