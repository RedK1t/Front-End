import redKitLogo from "@/assets/redKitLogo.svg";
import { PopoverTrigger } from "@radix-ui/react-popover";
function ChatTrigger() {
  return (
    <PopoverTrigger asChild>
      <button className="fixed right-10 bottom-10 z-10 cursor-pointer rounded-full bg-white/15 p-1 shadow-lg transition-all hover:scale-110 hover:bg-white/20 active:scale-95">
        <img src={redKitLogo} alt="Chat with RedKit" className="h-14 w-14" />
      </button>
    </PopoverTrigger>
  );
}

export default ChatTrigger;
