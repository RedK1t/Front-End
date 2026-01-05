import { IoIosArrowDown, IoMdSearch } from "react-icons/io";

export default function HeaderRightPart() {
  return (
    <div className="flex h-full items-center gap-1">
      <p className="h-full w-px bg-white"></p>
      <button className="bg-gray rounded-6px flex cursor-pointer items-center justify-center p-1.5">
        <IoIosArrowDown className="h-6 w-6" />
      </button>
      <button className="bg-gray rounded-6px flex cursor-pointer items-center justify-center p-1.5">
        <IoMdSearch className="h-6 w-6" />
      </button>
    </div>
  );
}
