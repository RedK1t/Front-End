import { useState } from "react";
import { motion } from "motion/react";
import Loader from "@/components/Loader";
import useCompanyOverview from "../hooks/useCompanyOverview";

// Logo (logo.dev) + a short paragraph about the target company (Wikipedia).
export default function CompanyOverview() {
  const { data, logoUrl, guessedName, isLoading } = useCompanyOverview();
  const [logoOk, setLogoOk] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="rounded-md bg-black/30 flex flex-col items-center gap-5 p-6 text-center"
    >
      {/* Logo */}
      {logoUrl && logoOk ? (
        <img
          src={logoUrl}
          alt={`${guessedName} logo`}
          onError={() => setLogoOk(false)}
          className="rounded-xl bg-white/5 h-24 w-24 object-contain p-2"
        />
      ) : (
        <div className="rounded-xl bg-white/5 flex h-24 w-24 items-center justify-center">
          <span className="heading-text text-dark-yellowish-white">
            {guessedName.charAt(0) || "?"}
          </span>
        </div>
      )}

      {/* Name + field */}
      <div className="flex flex-col gap-1">
        <h3 className="large-text text-white">{data?.title || guessedName}</h3>
        {data?.field && (
          <p className="small-text text-light-red capitalize">{data.field}</p>
        )}
      </div>

      {/* Paragraph */}
      {isLoading ? (
        <Loader />
      ) : data?.summary ? (
        <p className="normal-text text-dark-yellowish-white max-w-2xl leading-relaxed">
          {data.summary}
        </p>
      ) : (
        <p className="small-text text-dark-yellowish-white">
          No public company overview was found for this domain.
        </p>
      )}

      {data?.wikiUrl && (
        <a
          href={data.wikiUrl}
          target="_blank"
          rel="noreferrer"
          className="small-text text-blue"
        >
          Read more on Wikipedia
        </a>
      )}
    </motion.div>
  );
}
