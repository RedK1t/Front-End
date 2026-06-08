import { FaPaperPlane } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { FaQuestionCircle } from "react-icons/fa";

type ChatInputProps = {
  handleSendMessage: (text?: string) => void;
  input: string;
  setInput: (text: string) => void;
};

function ChatInput({ handleSendMessage, input, setInput }: ChatInputProps) {
  const { pathname } = useLocation();
  const handleHelpClick = () => {
    const helpMessage = `الصفحة ديه بتعمل اية [[${pathname}]]`;
    handleSendMessage(helpMessage);
  };

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
        onClick={handleHelpClick}
        className="bg-gray hover:bg-dark-gray text-yellowish-white cursor-pointer rounded-full p-2 transition-colors"
        title="What does this page do?"
      >
        <FaQuestionCircle className="h-4 w-4" />
      </button>
      <button
        onClick={() => handleSendMessage()}
        disabled={!input.trim()}
        className="bg-red hover:bg-light-red disabled:bg-gray cursor-pointer rounded-full p-2 text-white transition-all active:scale-90 disabled:cursor-not-allowed"
      >
        <FaPaperPlane
          className={`h-4 w-4 ${input.trim() ? "translate-x-0.5 -translate-y-0.5" : ""}`}
        />
      </button>
    </div>
  );
}

export default ChatInput;
