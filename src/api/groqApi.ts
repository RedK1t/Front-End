type Message = {
  role: string;
  content: string;
};

type chatProps = {
  messages: Message[];
  token?: string;
};

const ORCHESTRATOR_URL = import.meta.env.VITE_orchestrator_REST_url as string;

// The chat now goes through the orchestrator's /api/chat proxy, which holds the Groq
// key server-side (it never ships in the client bundle) and handles model fallback.
export async function chatWithGroq({ messages, token }: chatProps) {
  try {
    const response = await fetch(`${ORCHESTRATOR_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ messages }),
    });
    if (!response.ok) {
      console.error(`[chat] orchestrator responded ${response.status}`);
      return "error";
    }
    const result = (await response.json()) as Message;
    if (!result || typeof result.content !== "string") return "error";
    return result;
  } catch (error) {
    console.error(error);
    return "error";
  }
}
