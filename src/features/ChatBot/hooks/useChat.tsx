import { chatWithGroq } from "@/api/groqApi";
import { useEffect, useRef, useState } from "react";

function useChat() {
  const models = [
    "openai/gpt-oss-120b", // Egyptian Slang: Brins (Perfect) | Expert (High-Capacity) | Aug 2025
    "llama-3.3-70b-versatile", // Egyptian Slang: Saye' (Natural) | Advanced (Versatile) | Dec 2024
    "meta-llama/llama-4-maverick-17b-128e-instruct", // Egyptian Slang: Fahem (Smart) | Advanced (Next-Gen) | Apr 2025
    "meta-llama/llama-4-scout-17b-16e-instruct", // Egyptian Slang: Fahem (Smart) | Advanced (Next-Gen) | Apr 2025
    "openai/gpt-oss-safeguard-20b", // Egyptian Slang: Mo'adab (Polite/Safe) | Expert (Safeguard) | Oct 2025
    "moonshotai/kimi-k2-instruct-0905", // Egyptian Slang: Mazboot (Fluent) | Intermediate (Technical) | Sept 2025
    "groq/compound", // Egyptian Slang: Mazboot (Fluent) | Intermediate (General) | Sept 2025
    "openai/gpt-oss-20b", // Egyptian Slang: Mazboot (Fluent) | Intermediate (Mid-Scale) | Aug 2025
    "groq/compound-mini", // Egyptian Slang: Mashy (Basic) | Foundational (Efficient) | Sept 2025
    "llama-3.1-8b-instant", // Egyptian Slang: Mashy (Basic) | Foundational (Small-Scale) | Sept 2023
    "meta-llama/llama-guard-4-12b", // Egyptian Slang: Amin (Security Focused) | Expert (Security Guard) | May 2025
    "meta-llama/llama-prompt-guard-2-86m", // Egyptian Slang: Da'eef (Limited) | Expert (Prompt Guard) | May 2025
    "meta-llama/llama-prompt-guard-2-22m", // Egyptian Slang: Da'eef (Limited) | Expert (Prompt Guard) | May 2025
  ];
  const [messages, setMessages] = useState([
    {
      role: "system",
      content: import.meta.env.VITE_SYSTEM_PROMPT,
    },
    {
      role: "assistant",
      content: "أهلاً! أقدر أساعدك إزاي؟",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const modelNumber = useRef(0);

  useEffect(() => {
    // Scroll to the bottom of the messages container
    messagesRef?.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  function handleSendMessage(text = "") {
    const messageContent = typeof text === "string" ? text : "";
    if (!input.trim() && !messageContent.trim()) return;

    const userMessage = { role: "user", content: input || messageContent };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    chatWithGroq({
      model: models[modelNumber.current],
      messages: newMessages,
    })
      .then((res) => {
        if (res === "error") {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "Sorry, I encountered an error. Please try again.",
            },
          ]);
          modelNumber.current++;
          if (modelNumber.current >= models.length) {
            modelNumber.current = 0;
          }
        } else {
          setMessages((prev) => [...prev, res]);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  return {
    messages,
    input,
    setInput,
    handleSendMessage,
    messagesRef,
    isLoading,
  };
}

export default useChat;
