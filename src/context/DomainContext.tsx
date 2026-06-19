import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

// Persist the working target across reloads. The app's pages (Reconnaissance,
// sitemap, scope, scan history, …) read `domain`; keeping it only in memory meant
// a refresh reset it to null and those pages broke. We mirror it to localStorage so
// it survives a refresh and is restored on the next load.
const DOMAIN_KEY = "redkit:domain";
const SUBDOMAIN_KEY = "redkit:selectedSubdomain";

function readStored(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

interface DomainContextType {
  domain: string | null;
  setDomain: (domain: string) => void;
  selectedSubdomain: string | null;
  setSelectedSubdomain: (subdomain: string | null) => void;
}
const DomainContext = createContext<DomainContextType | undefined>(undefined);

export const DomainProvider = ({ children }: { children: ReactNode }) => {
  // Rehydrate from localStorage on first render so a refresh keeps the target.
  const [domain, setDomainState] = useState<string | null>(() =>
    readStored(DOMAIN_KEY),
  );
  const [selectedSubdomain, setSelectedSubdomainState] = useState<
    string | null
  >(() => readStored(SUBDOMAIN_KEY));

  // Setting the target (e.g. "Start Scan" in the Add Target modal) also saves it,
  // so it's available immediately and after any subsequent refresh.
  const setDomain = useCallback((d: string) => {
    setDomainState(d);
    try {
      localStorage.setItem(DOMAIN_KEY, d);
    } catch {
      /* storage unavailable — keep working in-memory */
    }
  }, []);

  const setSelectedSubdomain = useCallback((s: string | null) => {
    setSelectedSubdomainState(s);
    try {
      if (s === null) localStorage.removeItem(SUBDOMAIN_KEY);
      else localStorage.setItem(SUBDOMAIN_KEY, s);
    } catch {
      /* storage unavailable — keep working in-memory */
    }
  }, []);

  return (
    <DomainContext.Provider
      value={{ domain, setDomain, selectedSubdomain, setSelectedSubdomain }}
    >
      {children}
    </DomainContext.Provider>
  );
};

export const useDomain = () => {
  const context = useContext(DomainContext);
  if (!context) {
    throw new Error("useDomain must be used within a DomainProvider");
  }
  return context;
};
