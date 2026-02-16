import { useDomain } from "@/context/DomainContext";
import { useQuery } from "@tanstack/react-query";

type TechStackData = {
  urls: {
    [url: string]: {
      status: number;
    };
  };
  technologies: {
    slug: string;
    name: string;
    description: string;
    confidence: number;
    version: string;
    icon: string;
    website: string;
    cpe: string;
    categories: { id: number; slug: string; name: string }[];
    rootPath: boolean;
  }[];
};

function useGetTechStack() {
  const { domain } = useDomain();
  const { data, isFetching, error, refetch } = useQuery<TechStackData>({
    queryKey: ["tech-stack", domain],
    queryFn: async () => {
      const baseUrl = import.meta.env.DEV
        ? import.meta.env.VITE_web_check_local_url
        : import.meta.env.VITE_web_check_url;
      const res = await fetch(`${baseUrl}/tech-stack?url=${domain}`);
      return res.json();
    },
  });
  return { data, isFetching, error, refetch };
}

export default useGetTechStack;
