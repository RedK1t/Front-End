import Logo from "@/components/Logo";
import { PopoverTrigger } from "@radix-ui/react-popover";
function ChatTrigger() {
  return (
    <PopoverTrigger asChild>
      <button className="bg-gray fixed right-10 bottom-10 z-10 cursor-pointer rounded-full p-1 shadow-lg transition-all hover:scale-110 hover:bg-white/20 active:scale-95">
        <Logo alt="Chat with RedKit" className="h-14 w-14" />
      </button>
    </PopoverTrigger>
  );
}

export default ChatTrigger;
