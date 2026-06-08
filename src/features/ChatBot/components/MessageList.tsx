import type { RefObject } from "react";
import Markdown from "react-markdown";
import { useState, useEffect } from "react";
import remarkGfm from "remark-gfm";

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
                className="bg-red/80 animate-in slide-in-from-left-2 max-w-[95%] rounded-2xl rounded-tl-none px-4 py-2 text-start text-sm text-white shadow-md transition-all"
              >
                {item.content.replace(/\[\[.*?\]\]/g, "")}
              </div>
            </div>
          );
        if (item.role === "assistant") {
          const isLast = index === messages.length - 1 && !isLoading;
          return (
            <div key={index} className="flex justify-end">
              <div
                dir="auto"
                style={{ unicodeBidi: "isolate", display: "inline-block" }}
                className="chat-markdown text-yellowish-white animate-in slide-in-from-right-2 max-w-[95%] rounded-2xl rounded-tr-none bg-black/40 px-4 py-3 text-start text-sm shadow-lg ring-1 ring-white/10 transition-all"
              >
                <AssistantMessage content={item.content} isLast={isLast} />
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

function AssistantMessage({
  content,
  isLast,
}: {
  content: string;
  isLast: boolean;
}) {
  const [displayedContent, setDisplayedContent] = useState(
    isLast ? "" : content,
  );

  useEffect(() => {
    if (!isLast) {
      setDisplayedContent(content);
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      setDisplayedContent(content.slice(0, i));
      i++;
      if (i > content.length) {
        clearInterval(interval);
      }
    }, 5);

    return () => clearInterval(interval);
  }, [content, isLast]);

  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        input: ({ ...props }) => {
          if (props.type === "checkbox") {
            return (
              <input
                type="checkbox"
                defaultChecked={props.checked}
                className="checkbox checkbox-xs checkbox-error mr-2 border-white/20 align-middle"
                onClick={(e) => e.stopPropagation()}
              />
            );
          }
          return <input {...props} />;
        },
      }}
    >
      {displayedContent}
    </Markdown>
  );
}

export default MessageList;
