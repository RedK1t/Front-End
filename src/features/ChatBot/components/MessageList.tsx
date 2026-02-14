import type { RefObject } from "react";
import Markdown from "react-markdown";

type MessageListProps = {
  messages: { role: string; content: string }[];
  messagesRef: RefObject<HTMLDivElement | null>;
  isLoading: boolean;
};

function MessageList({ messages, messagesRef, isLoading }: MessageListProps) {
  return (
    <div
      ref={messagesRef}
      className="hide-scrollbar flex h-full flex-col gap-4 overflow-x-hidden overflow-y-auto"
    >
      {messages.map((item, index) => {
        if (item.role === "user")
          return (
            <div key={index} className="flex justify-start">
              <div
                dir="auto"
                style={{ unicodeBidi: "isolate" }}
                className="text-yellowish-white max-w-[95%] rounded-2xl rounded-bl-none bg-black/30 px-4 py-2 text-start text-sm shadow-sm"
              >
                {item.content}
              </div>
            </div>
          );
        if (item.role === "assistant") {
          return (
            <div key={index} className="flex justify-end">
              <div
                dir="rtl"
                style={{ unicodeBidi: "isolate", display: "inline-block" }}
                className="bg-red/70 max-w-[95%] rounded-2xl px-4 py-2 text-start text-sm wrap-break-word whitespace-normal text-white shadow-md"
              >
                <Markdown>{item.content}</Markdown>
              </div>
            </div>
          );
        }
      })}
      {isLoading && (
        <div className="flex justify-end">
          <div className="bg-red/90 rounded-2xl rounded-br-none px-4 py-2 text-white shadow-md">
            <span className="loading loading-dots loading-xs"></span>
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageList;
