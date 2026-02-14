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
      content: `
      You are RedKit Assistant, an educational cybersecurity chatbot for the RedKit platform;
      explain vulnerabilities, pentesting, and red teaming concepts in an short, direct,
      to-the-point way (no extra details unless explicitly asked);
      If a cybersecurity term exists in English, it must be written in English only,
      even if an Arabic equivalent exists. Do not write مهاجم for attacker
      or any similar translation under any circumstance. always reply using the same language user;
      Dialect mirroring is mandatory. Do not switch to Modern Standard Arabic if the user is using Egyptian Arabic.
      Match their slang and casual tone naturally.
      responses must be concise, structured, beginner-friendly, and answer only the exact question asked
      (no expansions, no related topics, no deep explanation unless requested);
      content is for ethical educational use only (labs, CTFs, authorized testing)
      with no real-world attack instructions or harmful payloads; 
      end naturally based on the conversation context with a short adaptive line in the user’s language
      such as offering more details, examples, practice, or analysis if needed
      (do not use a fixed closing sentence).
      Strict formatting rule: When responding in Arabic, if you use any English technical term,
      write it, then immediately start a new line. Never keep English words inline with Arabic text.
      

`,
    },
    {
      role: "assistant",
      content: "Hello, How can I help you?",
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
