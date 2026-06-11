import { FaPaperPlane } from "react-icons/fa";
import { IoAdd } from "react-icons/io5";

type HeaderLeftPartProps = {
  onSend: () => void;
  onAddTab: () => void;
};

export default function HeaderLeftPart({
  onSend,
  onAddTab,
}: HeaderLeftPartProps) {
  return (
    <div className="flex h-full items-center gap-1.5">
      <button
        className="bg-red small-text rounded-6px flex cursor-pointer items-center gap-1 px-2 py-2 text-white"
        onClick={onSend}
      >
        Send <FaPaperPlane />
      </button>
      <button
        className="bg-gray small-text rounded-6px flex cursor-pointer items-center gap-1 px-2 py-2 text-white"
        onClick={onAddTab}
      >
        <IoAdd />
      </button>
      <p className="h-full w-px bg-white"></p>
    </div>
  );
}
