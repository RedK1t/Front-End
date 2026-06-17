import { chatWithGroq } from "@/api/groqApi";
import useGetUserLocally from "@/hooks/useGetUserLocally";
import { useEffect, useRef, useState } from "react";

function useChat() {
  // The system prompt + model fallback now live server-side in the orchestrator's
  // /api/chat proxy, so the client only carries the visible conversation.
  const auth = useGetUserLocally();
  const token = auth?.access_token;
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "أهلاً! أقدر أساعدك إزاي؟",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

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
      messages: newMessages,
      token,
    })
      .then((res) => {
        if (res === "error") {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: "Sorry, I couldn't reach the assistant right now. Please try again.",
            },
          ]);
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
    setMessages,
  };
}

export const getAutoSummary = (pathname: string) => {
  const summaries: Record<string, string> = {
    "/Reconnaissance": "أنا هنا في **Reconnaissance**. أقدر أساعدك في البحث عن الـ subdomains والـ DNS records لأي target.",
    "/proxy/interceptor": "إحنا دلوقتي في الـ **Interceptor**. أقدر أشرحلك إزاي تعمل intercept للـ requests وتعدل عليها.",
    "/proxy/sitemap": "دي الـ **Sitemap**. هنا بنرسم خريطة لكل الـ endpoints اللي اكتشفناها للـ target.",
    "/AiScanner": "وصلنا للـ **AI Scanner**. أقدر أبدأ معاك فحص ذكي للثغرات وأشرحلك النتائج.",
    "/AiReport": "هنا الـ **Ai Report**. أقدر أساعدك تجمع كل اللي لقيناه وتطلعه في PDF محترم.",
    "/tools": "دي صفحة الـ **Tools**. فيها أدوات سريعة زي الـ Encoder والـ Hash Generator.",
  };

  const matchedKey = Object.keys(summaries).find((key) => pathname.startsWith(key));
  return summaries[matchedKey || ""] || "أهلاً بك في **RedKit**! أنا مساعدك الذكي في عمليات الـ Red Teaming والـ Pentesting. أقدر أساعدك إزاي النهاردة؟";
};

export default useChat;
