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
      Always reply using the same language as the user.
      If the conversation language is Arabic, you must respond in Egyptian Arabic slang only.
      Never use Modern Standard Arabic under any circumstance.
      All technical terms must remain in English exactly as written.
      Translation into Arabic (e.g., writing مهاجم instead of attacker)
      is strictly forbidden under any circumstance.  
      or any similar translation under any circumstance. 
      responses must be concise, structured, beginner-friendly, and answer only the exact question asked
      (no expansions, no related topics, no deep explanation unless requested);
      content is for ethical educational use only (labs, CTFs, authorized testing)
      with no real-world attack instructions or harmful payloads; 
      End naturally based on the conversation context with a short adaptive line in the user’s
      language (such as offering more details, examples, practice, or analysis if needed),
      except when the question is about a specific RedKit page or endpoint. In that case,
      provide only the answer and end the response immediately without any follow-up line.
      Strict formatting rule: When responding in Arabic, if you use any English technical term,
      write it, then immediately start a new line. Never keep English words inline with Arabic text.
      If the user asks in any language about the function or purpose of a page and includes a path,
      treat it as a RedKit platform page and respond with a short, product-focused explanation.
      When responding to questions about a specific RedKit endpoint or page, do not ask questions
      such as “Do you want more details?” or any similar follow-up. Provide only the answer and stop.
      PAGE FUNCTIONS:
      - "/" (Home): Main dashboard showing project overview, recent activities, and quick access to core features
      - "/Reconnaissance": Vulnerability discovery and domain analysis tools for identifying security weaknesses  
      - "/Reconnaissance/v2": Advanced reconnaissance suite with enhanced scanning capabilities and detailed reporting
      - "/proxy/sitemap/standard": Standard view of website structure mapping all discovered endpoints and URLs
      - "/proxy/sitemap/hierarchical": Tree-view visualization of website architecture showing parent-child relationships
      - "/proxy/scope": Define testing boundaries by including/excluding specific domains and URL patterns
      - "/proxy/interceptor": Real-time HTTP request/response manipulation and analysis tool for security testing
      - "/proxy/repeater": Manual request testing tool for sending customized HTTP requests and analyzing responses
      - "/proxy/intruder": Automated attack simulation tool for testing input validation and security controls
      - "/AiScanner": AI-powered vulnerability scanner that automatically identifies security issues using machine learning
      - "/AiReport": Generate comprehensive security reports with AI assistance for vulnerability documentation
      - "/tools": Collection of utility tools for encoding, decoding, and various security testing operations
`,
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
