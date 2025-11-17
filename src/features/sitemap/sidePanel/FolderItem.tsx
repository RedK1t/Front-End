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
  function handleSelect() {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("folder", id);
    setSearchParams(newSearchParams, { replace: true });
  }
  return (
    <div className="flex justify-end pr-[9px]">
      <div className="flex flex-col">
        <div
          onClick={handleSelect}
          className={`text-yellowish-white normal-text flex cursor-pointer items-center justify-end gap-1 rounded py-1 pl-12 ${isSelected ? "bg-red/30" : ""}`}
        >
          <p>{folderName}</p>
          <FolderIcon className="text-yellow h-4 w-4" />
          <button onClick={() => setIsOpen((prev) => !prev)}>
            <IoMdArrowDropdown
              className={`h-5 w-5 transition-all duration-100 ${isOpen ? "" : "rotate-90"}`}
            />
          </button>
        </div>

        {isOpen && children}
      </div>
      <div
        className={`ml-3 h-full w-px self-stretch ${withLine ? "bg-dark-yellowish-white" : "bg-black"}`}
      />
    </div>
  );
}
