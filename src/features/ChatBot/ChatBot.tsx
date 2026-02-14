import { Popover, PopoverContent } from "@/components/ui/popover";
import useChat from "./hooks/useChat";
import ChatTrigger from "./components/ChatTrigger";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";

export default function ChatBot() {
  const {
    messages,
    input,
    setInput,
    handleSendMessage,
    messagesRef,
    isLoading,
  } = useChat();
  return (
    <Popover>
      <ChatTrigger />
      <PopoverContent className="bg-gray mr-12 h-[75vh] max-h-[75vh] w-96 border-0 text-white shadow-2xl ring-1 ring-white/10">
        <div className="flex h-full flex-col gap-4 p-2">
          <div className="min-h-0 flex-1">
            <MessageList
              messages={messages}
              messagesRef={messagesRef}
              isLoading={isLoading}
            />
          </div>
          {/* {messages.length <= 2 && (
            <div className="flex shrink-0 flex-wrap gap-2 px-1">
              {["horror game", "Best RPGs right now?", "Cozy indie game?"].map(
                (text) => (
                  <button
                    key={text}
                    onClick={() => {
                      handleSendMessage(text);
                    }}
                    className="bg-red-transparent hover:bg-red/20 border-red/30 text-yellowish-white cursor-pointer rounded-full border px-3 py-1.5 text-xs font-bold transition-colors"
                  >
                    {text}
                  </button>
                ),
              )}
            </div>
          )} */}
          <div className="shrink-0 rounded-xl bg-black/40 p-2">
            <ChatInput
              handleSendMessage={handleSendMessage}
              input={input}
              setInput={setInput}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
