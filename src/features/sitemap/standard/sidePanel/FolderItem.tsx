import { FolderIcon } from "lucide-react";
import { useState, type ReactNode } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { useSearchParams } from "react-router-dom";

type FolderItemProps = {
  children?: ReactNode;
  folderName: string;
  withLine?: boolean;
  id: string;
};

export default function FolderItem({
  children,
  folderName,
  withLine = true,
  id,
}: FolderItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const isSelected = searchParams.get("folder") === id;

  // Set Filter to Search Params
  function handleSelect() {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("folder", id);
    setSearchParams(newSearchParams, { replace: true });
  }
  return (
    <div className="flex justify-end pr-[9px]">
      <div className="flex flex-col">
        {/* Folder Row */}
        <div
          onClick={handleSelect}
          className={`text-yellowish-white normal-text flex cursor-pointer items-center justify-end gap-1 rounded py-1 pl-12 ${isSelected ? "bg-red/30" : ""}`}
        >
          <p>{folderName}</p>
          <FolderIcon className="text-yellow h-4 w-4" />
          <button onClick={() => setIsOpen((prev) => !prev)}>
            <IoMdArrowDropdown
              className={`h-5 w-5 transition-all duration-200 ease-in-out ${isOpen ? "" : "rotate-90"}`}
            />
          </button>
        </div>

        {/* Embedded folders */}
        <div
          className={`flex flex-col overflow-hidden transition-all duration-200 ease-in-out ${isOpen ? "max-h-[1000px]" : "max-h-0"}`}
        >
          {children}
        </div>
      </div>

      {/* Line */}
      <div
        className={`ml-3 h-full w-px self-stretch ${withLine ? "bg-dark-yellowish-white" : "bg-black"}`}
      />
    </div>
  );
}
