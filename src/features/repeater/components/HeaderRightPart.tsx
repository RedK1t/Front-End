import { IoIosArrowDown, IoIosArrowUp, IoMdSearch } from "react-icons/io";

type HeaderRightPartProps = {
  isExtended: boolean;
  setIsExtended: (isExtended: boolean) => void;
};

export default function HeaderRightPart({
  isExtended,
  setIsExtended,
}: HeaderRightPartProps) {
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
        <IoMdSearch className="h-6 w-6" />
      </button>
    </div>
  );
}
