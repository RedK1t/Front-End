import { createContext, useContext, useState, type ReactNode } from "react";

interface DomainContextType {
  domain: string | null;
  setDomain: (domain: string) => void;
  selectedSubdomain: string | null;
  setSelectedSubdomain: (subdomain: string | null) => void;
}
const DomainContext = createContext<DomainContextType | undefined>(undefined);

export const DomainProvider = ({ children }: { children: ReactNode }) => {
  const [domain, setDomain] = useState<string | null>(null);
  const [selectedSubdomain, setSelectedSubdomain] = useState<string | null>(
    null,
  );

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
