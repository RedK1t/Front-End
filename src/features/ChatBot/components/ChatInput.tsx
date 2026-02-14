import { FaPaperPlane } from "react-icons/fa";

type ChatInputProps = {
  handleSendMessage: (text?: string) => void;
  input: string;
  setInput: (text: string) => void;
};

function ChatInput({ handleSendMessage, input, setInput }: ChatInputProps) {
  return (
    <div className="flex h-full items-end gap-2">
      <textarea
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me anything..."
        style={{ fieldSizing: "content" }}
        dir="auto"
        className="auto-expand text-yellowish-white placeholder:text-dark-yellowish-white max-h-[20vh] min-h-6 w-full resize-none overflow-auto bg-transparent py-1 ring-transparent outline-none"
      />
      <button
        onClick={() => handleSendMessage()}
        className="bg-red hover:bg-light-red cursor-pointer rounded-full p-2 text-white transition-colors"
      >
        <FaPaperPlane className="h-4 w-4" />
      </button>
    </div>
  );
}

export default ChatInput;
