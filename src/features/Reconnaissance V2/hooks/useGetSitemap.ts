import { useDomain } from "@/context/DomainContext";
import { useQuery } from "@tanstack/react-query";

type SitemapData = {
  urlset?: {
    $: {
      xmlns: string;
      "xmlns:xsi": string;
      "xsi:schemaLocation": string;
    };
    url: {
      loc: string[];
      lastmod: string[];
      changefreq: string[];
      priority: number[];
    }[];
  };

  sitemapindex?: {
    $: {
      xmlns: string;
    };
    sitemap: {
      loc: string[];
    }[];
  };
};

function useGetSitemap() {
  const { domain } = useDomain();
  const { data, isLoading, error } = useQuery<SitemapData>({
    queryKey: ["sitemap", domain],
    queryFn: async () => {
      const baseUrl = import.meta.env.DEV
        ? "/web-check-proxy"
        : import.meta.env.VITE_web_check_url;
      const res = await fetch(`${baseUrl}/sitemap?url=${domain}`);
      return res.json();
    },
  });
  return { data, isLoading, error };
}

export default useGetSitemap;
