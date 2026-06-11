import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useRef } from "react";
import Tab from "./Tab";
import type { RepeaterTab } from "../types";

type TabsListProps = {
  isExtended: boolean;
  tabs: RepeaterTab[];
  activeTabId: string;
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onTabRename: (tabId: string, newName: string) => void;
};

export default function TabsList({
  isExtended,
  tabs,
  activeTabId,
  onTabClick,
  onTabClose,
  onTabRename,
}: TabsListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };
  return (
    <div className="flex h-full w-full items-start gap-1 overflow-hidden">
      {!isExtended && (
        <button
          className="bg-gray rounded-6px hover:bg-gray/80 flex cursor-pointer items-center justify-center py-1.5 transition-colors"
          onClick={scrollLeft}
        >
          <IoIosArrowBack className="h-6 w-6" />
        </button>
      )}

      <div
        ref={scrollContainerRef}
        className={`hide-scrollbar flex h-full w-full items-start justify-start gap-1 ${isExtended ? "flex-wrap overflow-x-hidden overflow-y-auto" : "overflow-auto"}`}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            text={tab.name}
            isActive={tab.id === activeTabId}
            onClose={() => onTabClose(tab.id)}
            onClick={() => onTabClick(tab.id)}
            onRename={(newName) => onTabRename(tab.id, newName)}
          />
        ))}
      </div>
      {!isExtended && (
        <button
          className="bg-gray rounded-6px hover:bg-gray/80 flex cursor-pointer items-center justify-center py-1.5 transition-colors"
          onClick={scrollRight}
        >
          <IoIosArrowForward className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
