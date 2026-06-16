import { useDomain } from "@/context/DomainContext";
import { useQuery } from "@tanstack/react-query";

const LOGO_DEV_PUBLIC_KEY = import.meta.env.VITE_LOGO_DEV_PUBLIC_KEY;

export type CompanyOverview = {
  /** Page/company title. */
  title: string;
  /** Short "what is it" line (e.g. "Photo and video sharing service"). */
  field: string | null;
  /** A paragraph describing the company. */
  summary: string | null;
  /** Link to the Wikipedia article. */
  wikiUrl: string | null;
};

// Best-guess company name from a domain: drop the protocol, "www." and the TLD.
// e.g. "www.instagram.com" -> "Instagram", "google.com" -> "Google".
export function companyNameFromDomain(domain: string): string {
  const host = domain.replace(/^https?:\/\//, "").replace(/^www\./, "");
  const label = host.split(".")[0] || host;
  return label.charAt(0).toUpperCase() + label.slice(1);
}

type WikiSummary = {
  type?: string;
  title?: string;
  description?: string;
  extract?: string;
  content_urls?: { desktop?: { page?: string } };
};

// Words that signal the article is about a company / product / online service —
// these are what we WANT to surface for a target domain.
const COMPANY_HINTS = [
  "company",
  "corporation",
  "corp",
  " inc",
  "multinational",
  "subsidiary",
  "enterprise",
  "business",
  "brand",
  "startup",
  "platform",
  "service",
  "website",
  "web service",
  "online",
  "internet",
  "software",
  "technology",
  "social media",
  "social network",
  "search engine",
  "e-commerce",
  "marketplace",
  "application",
  " app ",
  "streaming",
  "messaging",
  "developer",
  "manufacturer",
  "retailer",
  "bank",
  "financial",
  "media company",
  "founded",
  "headquarter",
];

// Words that signal the article is clearly NOT a company (the letter "X", a
// given name, a river, an element …) — used to reject an irrelevant direct hit.
const NON_COMPANY_HINTS = [
  "letter of the",
  "alphabet",
  "given name",
  "surname",
  "family name",
  "chemical element",
  "river",
  "genus",
  "species",
  "unit of",
  "mathematic",
  "may refer to",
];

function isCompanyLike(s: WikiSummary): boolean {
  const text = `${s.description ?? ""} ${s.extract ?? ""}`.toLowerCase();
  if (NON_COMPANY_HINTS.some((h) => text.includes(h))) return false;
  return COMPANY_HINTS.some((h) => text.includes(h));
}

function isUsableSummary(s: WikiSummary | null): s is WikiSummary {
  return !!s && s.type !== "disambiguation" && !!s.extract;
}

function toOverview(s: WikiSummary, guessedName: string): CompanyOverview {
  return {
    title: s.title || guessedName,
    field: s.description ?? null,
    summary: s.extract ?? null,
    wikiUrl: s.content_urls?.desktop?.page ?? null,
  };
}

async function fetchSummary(title: string): Promise<WikiSummary | null> {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        title,
      )}`,
    );
    if (!res.ok) return null;
    return (await res.json()) as WikiSummary;
  } catch {
    return null;
  }
}

// Free, CORS-enabled MediaWiki search (origin=*). Returns candidate article
// titles ranked by relevance.
async function searchTitles(query: string): Promise<string[]> {
  try {
    const url =
      `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*` +
      `&list=search&srlimit=6&srsearch=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const json = await res.json();
    const hits: { title?: string }[] = json?.query?.search ?? [];
    return hits.map((h) => h.title).filter((t): t is string => !!t);
  } catch {
    return [];
  }
}

/**
 * Free company overview for the target: the logo comes from logo.dev (by
 * domain) and the description/field come from Wikipedia.
 *
 * Relevance handling: the naive "summary of the bare name" lookup often returns
 * the wrong article for short/ambiguous names (e.g. x.com → the letter "X"). So
 * we accept the direct hit only when it reads like a company, otherwise we fall
 * back to a company-biased Wikipedia search and pick the first company-like
 * result. Degrades gracefully to just the guessed name when nothing fits.
 */
export default function useCompanyOverview() {
  const { domain } = useDomain();

  const logoUrl = domain
    ? `https://img.logo.dev/${domain}?token=${LOGO_DEV_PUBLIC_KEY}&format=png&retina=true`
    : null;

  const guessedName = domain ? companyNameFromDomain(domain) : "";

  const { data, isLoading, error } = useQuery<CompanyOverview>({
    queryKey: ["company-overview", domain],
    enabled: !!domain,
    queryFn: async () => {
      const fallback: CompanyOverview = {
        title: guessedName,
        field: null,
        summary: null,
        wikiUrl: null,
      };

      // 1) Direct lookup — keep it only if it actually looks like a company.
      const direct = await fetchSummary(guessedName);
      if (isUsableSummary(direct) && isCompanyLike(direct)) {
        return toOverview(direct, guessedName);
      }

      // 2) Company-biased search; return the first company-like candidate.
      const queries = [
        `${guessedName} (company)`,
        `${guessedName} company`,
        guessedName,
      ];
      const tried = new Set<string>([guessedName]);
      let checked = 0;
      for (const q of queries) {
        const titles = await searchTitles(q);
        for (const title of titles) {
          if (tried.has(title) || checked >= 6) continue;
          tried.add(title);
          checked++;
          const s = await fetchSummary(title);
          if (isUsableSummary(s) && isCompanyLike(s)) {
            return toOverview(s, guessedName);
          }
        }
      }

      // 3) Nothing clearly company-like — use the direct hit if it was at least
      // a real (non-disambiguation) article, else the bare fallback.
      if (isUsableSummary(direct)) return toOverview(direct, guessedName);
      return fallback;
    },
  });

  return { data, logoUrl, guessedName, isLoading, error };
}
