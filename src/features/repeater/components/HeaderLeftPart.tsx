import { FaPaperPlane } from "react-icons/fa";

export default function HeaderLeftPart() {
  return (
    <div className="flex h-full items-center gap-1.5">
      <button className="bg-red small-text rounded-6px flex cursor-pointer items-center gap-1 px-2 py-2 text-white">
        Send <FaPaperPlane />
      </button>
      <p className="h-full w-px bg-white"></p>
    </div>
  );
}
