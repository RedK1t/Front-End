import { useDomain } from "@/context/DomainContext";
import useGetUserLocally from "@/hooks/useGetUserLocally";
import { useQuery } from "@tanstack/react-query";

export type CompanyInfo = {
  companyName: string | null;
  industry: string | null;
  headquarters: string | null;
  yearFounded: string | null;
  founders: string[] | null;
  keyExecutives: string[] | null;
  website: string | null;
  description: string | null;
  servicesAndProducts: string[] | null;
  contactEmail: string | null;
  contactPhone: string | null;
  socialMedia: {
    linkedin: string | null;
    twitter: string | null;
    facebook: string | null;
    instagram: string | null;
    youtube: string | null;
    github: string | null;
    [key: string]: string | null;
  } | null;
  employeeCount: string | null;
  revenue: string | null;
  parentCompany: string | null;
  subsidiaries: string[] | null;
  stockSymbol: string | null;
  certifications: string[] | null;
  awards: string[] | null;
};

export default function useGetCompInfo() {
  // Calls go through the orchestrator's authenticated Groq proxy (/api/groq) so the
  // key stays server-side; model fallback is handled there.
  const { domain } = useDomain();
  const auth = useGetUserLocally();
  const token = auth?.access_token;
  const ORCHESTRATOR_URL = import.meta.env.VITE_orchestrator_REST_url as string;
  const messages = [
    {
      role: "system",
      content: `
You are a company research assistant.
For the given domain name, return ONLY valid JSON containing all publicly available factual information about the associated company.

Response must strictly follow this JSON schema:
{
  "companyName": string or null,
  "industry": string or null,
  "headquarters": string or null,
  "yearFounded": string or null,
  "founders": array of strings or null,
  "keyExecutives": array of strings or null,
  "website": string or null,
  "description": string or null,
  "servicesAndProducts": array of strings or null,
  "contactEmail": string or null,
  "contactPhone": string or null,
  "socialMedia": {
    "linkedin": string or null,
    "twitter": string or null,
    "facebook": string or null,
    "instagram": string or null,
    "youtube": string or null,
    "github": string or null
  } or null,
  "employeeCount": string or null,
  "revenue": string or null,
  "parentCompany": string or null,
  "subsidiaries": array of strings or null,
  "stockSymbol": string or null,
  "certifications": array of strings or null,
  "awards": array of strings or null
}

Rules:
1. Only include VERIFIED, publicly available factual information
2. If a field is unknown, set it to null (do NOT guess or fabricate)
3. Return ONLY valid JSON, no extra text, no markdown, no explanations
4. Do NOT wrap in code blocks or backticks
`,
    },
    {
      role: "user",
      content: `${domain}`,
    },
  ];
  const { data, isLoading, error } = useQuery<{
    companyInfo: CompanyInfo | null;
  }>({
    queryKey: ["compInfo", domain],
    queryFn: async () => {
      const res = await fetch(`${ORCHESTRATOR_URL}/api/groq`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          messages,
          response_format: { type: "json_object" },
        }),
      });
      if (!res.ok) throw new Error(`groq proxy responded ${res.status}`);
      const msg = (await res.json()) as { role: string; content: string };
      let companyInfo: CompanyInfo | null = null;
      try {
        if (msg?.content) companyInfo = JSON.parse(msg.content);
      } catch {
        companyInfo = null;
      }
      return { companyInfo };
    },
  });
  return {
    data,
    isLoading,
    error,
  };
}
