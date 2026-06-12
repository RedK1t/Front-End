import { useDomain } from "@/context/DomainContext";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

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

type OpenAIChoice = {
  index: number;
  message: {
    role: string;
    content: string;
    reasoning?: string;
  };
  logprobs: null;
  finish_reason: string;
};

type OpenAIResponse = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: OpenAIChoice[];
  usage: {
    queue_time: number;
    prompt_tokens: number;
    prompt_time: number;
    completion_tokens: number;
    completion_time: number;
    total_tokens: number;
    total_time: number;
    prompt_tokens_details: {
      cached_tokens: number;
    };
    completion_tokens_details: {
      reasoning_tokens: number;
    };
  };
  usage_breakdown: null;
  system_fingerprint: string;
  x_groq: {
    id: string;
    seed: number;
  };
  service_tier: string;
};

export default function useGetCompInfo() {
  const models = [
    "openai/gpt-oss-120b", //  Aug 2025
    "openai/gpt-oss-safeguard-20b", // Oct 2025
    "moonshotai/kimi-k2-instruct-0905", //  Sept 2025
    "groq/compound", //  Sept 2025
    "groq/compound-mini", //  Sept 2025
    "openai/gpt-oss-20b", //  Aug 2025
    "meta-llama/llama-guard-4-12b", //  May 2025
    "meta-llama/llama-prompt-guard-2-86m", // May 2025
    "meta-llama/llama-prompt-guard-2-22m", //  May 2025
    "meta-llama/llama-4-maverick-17b-128e-instruct", //  Apr 2025
    "meta-llama/llama-4-scout-17b-16e-instruct", //  Apr 2025
    "llama-3.3-70b-versatile", //  Dec 2024
    "llama-3.1-8b-instant", //  Sept 2023
  ];
  const [modelNumber, setModelNumber] = useState(0);
  const { domain } = useDomain();
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
  const url = "https://api.groq.com/openai/v1/chat/completions";
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: models[modelNumber],
      messages,
      temperature: 0.3,
      response_format: { type: "json_object" },
    }),
  };

  const { data, isLoading, error } = useQuery<{
    openAIResponse: OpenAIResponse;
    companyInfo: CompanyInfo | null;
  }>({
    queryKey: ["compInfo", domain],
    queryFn: async () => {
      const res = await fetch(url, options);
      const openAIResponse: OpenAIResponse = await res.json();
      let companyInfo: CompanyInfo | null = null;
      try {
        const content = openAIResponse.choices[0]?.message.content;
        if (content) {
          companyInfo = JSON.parse(content);
        }
      } catch {
        companyInfo = null;
      }
      return { openAIResponse, companyInfo };
    },
    throwOnError: () => {
      if (modelNumber < models.length - 1) {
        setModelNumber((prev) => prev + 1);
      }
      return false;
    },
  });
  return {
    data,
    isLoading,
    error,
  };
}
