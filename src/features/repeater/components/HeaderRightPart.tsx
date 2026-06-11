import { IoIosArrowDown, IoIosArrowUp, IoMdSearch } from "react-icons/io";

import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { RepeaterTab } from "../types";

type HeaderRightPartProps = {
  isExtended: boolean;
  setIsExtended: (isExtended: boolean) => void;
  tabs: RepeaterTab[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectTab: (tabId: string) => void;
};

export default function HeaderRightPart({
  isExtended,
  setIsExtended,
  tabs,
  searchQuery,
  setSearchQuery,
  onSelectTab,
}: HeaderRightPartProps) {
  const filteredTabs = tabs.filter(
    (tab) =>
      tab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tab.request.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex h-full items-center gap-1">
      <p className="h-full w-px bg-white"></p>
      <button
        className="bg-gray rounded-6px flex cursor-pointer items-center justify-center p-1.5"
        onClick={() => setIsExtended(!isExtended)}
      >
        {isExtended ? (
          <IoIosArrowUp className="h-6 w-6" />
        ) : (
          <IoIosArrowDown className="h-6 w-6" />
        )}
      </button>
      <button className="bg-gray rounded-6px flex cursor-pointer items-center justify-center p-1.5">
        <Popover>
          <PopoverTrigger asChild>
            <IoMdSearch className="h-6 w-6" />
          </PopoverTrigger>
          <PopoverContent className="bg-gray h-60 w-48 overflow-y-auto px-2 py-1">
            <Input
              placeholder="Search"
              className="small-text focus-visible:ring-none border-yellowish-white mb-2 h-7 w-full rounded-md px-2 py-1 text-white ring-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <div className="text-yellowish-white *:hover:bg-yellowish-white *:hover:text-gray flex h-full w-full flex-col gap-y-1 *:cursor-pointer *:rounded-sm *:px-1">
              {filteredTabs.length > 0 ? (
                filteredTabs.map((tab) => (
                  <p
                    key={tab.id}
                    onClick={() => {
                      onSelectTab(tab.id);
                      setSearchQuery("");
                    }}
                  >
                    {tab.name}
                  </p>
                ))
              ) : (
                <p className="text-gray-500">No tabs found</p>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </button>
    </div>
  );
}
