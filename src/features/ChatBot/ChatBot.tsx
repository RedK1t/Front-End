import { Popover, PopoverContent } from "@/components/ui/popover";
import useChat from "./hooks/useChat";
import ChatTrigger from "./components/ChatTrigger";
import MessageList from "./components/MessageList";
import ChatInput from "./components/ChatInput";
import { FaTrashAlt } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

export default function ChatBot() {
  const { pathname } = useLocation();
  const {
    messages,
    input,
    setInput,
    handleSendMessage,
    messagesRef,
    isLoading,
    setMessages,
  } = useChat();

  const quickSuggestions = useMemo(() => {
    const baseSuggestions = [
      {
        label: "What is RedKit?",
        text: "What is RedKit and how can it help me?",
      },
    ];

    const contextSuggestions: Record<
      string,
      { label: string; text: string }[]
    > = {
      "/Reconnaissance": [
        {
          label: "How to scan subdomains?",
          text: "How do I use the Reconnaissance tool to find subdomains?",
        },
        {
          label: "What is WHOIS?",
          text: "Can you explain what WHOIS information tells me about a target?",
        },
      ],
      "/proxy/interceptor": [
        {
          label: "How to intercept?",
          text: "How do I intercept and modify HTTP requests here?",
        },
        {
          label: "What is 'Forward'?",
          text: "What happens when I click 'Forward' or 'Drop'?",
        },
      ],
      "/proxy/sitemap": [
        {
          label: "What is a Sitemap?",
          text: "How does the sitemap help me map out a target's attack surface?",
        },
      ],
      "/AiScanner": [
        {
          label: "How to start a scan?",
          text: "How do I start an AI-powered vulnerability scan?",
        },
        {
          label: "What can it find?",
          text: "What types of vulnerabilities can the AI Scanner detect?",
        },
      ],
      "/AiReport": [
        {
          label: "How to export?",
          text: "How do I generate and export a professional pentest report?",
        },
      ],
    };

    // Find the best match for the current pathname
    const matchedKey = Object.keys(contextSuggestions).find((key) =>
      pathname.startsWith(key),
    );
    const matchedSuggestions = matchedKey
      ? contextSuggestions[matchedKey]
      : [
          {
            label: "Pentesting Tips",
            text: "Give me some beginner pentesting tips.",
          },
          { label: "Help with this page", text: "What does this page do?" },
        ];

    return [...baseSuggestions, ...matchedSuggestions].slice(0, 3);
  }, [pathname]);

  const handleClearChat = () => {
    setMessages([
      {
        role: "system",
        content: import.meta.env.VITE_SYSTEM_PROMPT,
      },
      {
        role: "assistant",
        content: "أهلاً! أقدر أساعدك إزاي؟",
      },
    ]);
  };

  return (
    <Popover>
      <ChatTrigger />
      <PopoverContent className="bg-gray animate-in fade-in zoom-in-95 mr-12 h-[75vh] max-h-[75vh] w-96 border-0 text-white shadow-2xl ring-1 ring-white/10 transition-all duration-300">
        <div className="flex h-full flex-col gap-4 p-2">
          <div className="flex items-center justify-between border-b border-white/5 px-1 pb-2">
            <h3 className="text-yellowish-white text-sm font-bold">
              RedKit Assistant
            </h3>
            <button
              onClick={handleClearChat}
              className="hover:text-red p-1 text-white/40 transition-colors"
              title="Clear chat"
            >
              <FaTrashAlt className="h-3 w-3" />
            </button>
          </div>
          <div className="min-h-0 flex-1">
            <MessageList
              messages={messages}
              messagesRef={messagesRef}
              isLoading={isLoading}
            />
          </div>

          {messages.length <= 2 && (
            <div className="flex shrink-0 flex-wrap gap-2 px-1">
              {quickSuggestions.map((suggestion) => (
                <button
                  key={suggestion.label}
                  onClick={() => handleSendMessage(suggestion.text)}
                  className="hover:bg-red/20 text-yellowish-white cursor-pointer rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium transition-all hover:scale-105 active:scale-95"
                >
                  {suggestion.label}
                </button>
              ))}
            </div>
          )}

          <div className="focus-within:ring-red/50 shrink-0 rounded-xl bg-black/40 p-2 ring-1 ring-white/5 transition-shadow">
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
