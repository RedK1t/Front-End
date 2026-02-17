import { useDomain } from "@/context/DomainContext";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type response = {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
      reasoning?: string;
    };
    logprobs: null;
    finish_reason: string;
  }[];
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
        For every domain name I provide, your task is to return all publicly available factual information about the company associated with that domain.
        Rules:
        Only provide verified, real, publicly available information.
        Do NOT guess, assume, or fabricate any details.
        Clearly structure the output using section headers followed by plain text data (e.g., Company Name, Industry, Location, Founders, Year Founded, Services, Contact Information, Social Media, etc.).
        Do NOT use tables in the response. Use headers and structured text only.
        If some fields are available and others are not, include the available data and write “No information found” for the missing fields.
        Keep the response factual, neutral, and concise.
        Do not include opinions or marketing language.
        Never end the response with follow-up offers, suggestions,
        or phrases such as “If you need more information, let me know.”
        End the output immediately after providing the requested data.
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
      temperature: 0.5,
    }),
  };

  const { data, isLoading, error } = useQuery<response>({
    queryKey: ["compInfo", domain],
    queryFn: () => fetch(url, options).then((res) => res.json()),
    throwOnError: () => {
      setModelNumber((prev) => prev + 1);
      if (modelNumber >= models.length) {
        setModelNumber(0);
      }
      return false; // don't propagate to error boundary
    },
  });
  return {
    data,
    isLoading,
    error,
  };
}
