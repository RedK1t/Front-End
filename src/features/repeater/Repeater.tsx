import BottomPanel from "./../reqResPanel/BottomPanel";
import TabsList from "./components/TabsList";
import HeaderLeftPart from "./components/HeaderLeftPart";
import HeaderRightPart from "./components/HeaderRightPart";

export default function Repeater() {
  return (
    <div className="flex h-screen w-full flex-col">
      <div className="border-light-red flex h-[7%] w-full items-center justify-between gap-1.5 border-b px-2 py-1">
        <HeaderLeftPart />
        <TabsList />
        <HeaderRightPart />
      </div>
      <div className="h-full">
        <BottomPanel />
      </div>
    </div>
  );
}
