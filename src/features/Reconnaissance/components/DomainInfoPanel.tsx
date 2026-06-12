import { useSearchParams } from "react-router-dom";
// import copyIcon from "../../../assets/copyIcon.svg";
// import exportIcon from "../../../assets/ExportIcon.svg";
import InfoRow from "./InfoRow";
import useWhoisDnsRecords from "../hooks/useWhoisDnsRecords";
import useGetCrt from "../hooks/useGetCrt";
import CrtRow from "./CrtRow";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import useGetCompInfo from "../hooks/useGetCompInfo";
import CompanyInfoView from "./CompanyInfo";
import Loader from "@/components/Loader";

export default function DomainInfoPanel() {
  const [searchParams] = useSearchParams();
  const {
    data: compInfo,
    isLoading: compInfoIsLoading,
    error: compInfoError,
  } = useGetCompInfo();
  const { data, error, isFetching } = useWhoisDnsRecords();
  const {
    data: crtData,
    isLoading: crtIsLoading,
    error: crtError,
  } = useGetCrt();

  const filter = searchParams.get("dig") || "WHOIS";
  return (
    /*  Panel */
    <div className="bg-gray flex h-[80dvh] w-full flex-col gap-y-5 rounded-md px-6 py-6 lg:w-1/2">
      {/*  Header */}
      <div className="flex w-full items-center justify-between">
        <p className="large-text text-white">{filter}</p>

        {/*  Header Buttons */}
        {/* <div className="flex items-center gap-2">
          <button className="bg-gray normal-text border-dark-yellowish-white flex cursor-pointer gap-3.5 rounded-md border px-2.5 py-2">
            <img src={copyIcon} alt="copy icon" />
            Copy
          </button>
          <button className="bg-gray normal-text border-dark-yellowish-white flex cursor-pointer gap-3.5 rounded-md border px-2.5 py-2">
            <img src={exportIcon} alt="export icon" />
            Export
          </button>
        </div> */}
      </div>

      {/*  Domain INFO */}
      <div
        key={filter}
        className="flex flex-col gap-3 overflow-x-hidden overflow-y-auto"
      >
        {isFetching && (filter === "DNS" || filter === "WHOIS") && (
          <div className="flex justify-center">
            <span className="loading bg-red loading-spinner h-12 w-12"></span>
          </div>
        )}
        {error && <p className="text-red text-center">{error.message}</p>}
        {!data?.success && (
          <p className="text-red text-center">{data?.error}</p>
        )}
        {data?.success && filter === "DNS" && (
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            key={`${filter}-${data}`}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-3"
          >
            {data.dns?.records.MX && (
              <InfoRowAnimation>
                <InfoRow
                  label="MX"
                  value={
                    data.dns?.records.MX
                      ? data.dns.records.MX.map(
                          (mx) => `Priority: ${mx.priority} - ${mx.exchange}`,
                        ).join("\n")
                      : "-"
                  }
                />
              </InfoRowAnimation>
            )}
            {data.dns?.records.SRV && (
              <InfoRowAnimation>
                <InfoRow
                  label="SRV"
                  value={
                    data.dns?.records.SRV
                      ? data.dns.records.SRV.map(
                          (srv) =>
                            `Priority: ${srv.priority} - Weight: ${srv.weight} - Port: ${srv.port} - Target: ${srv.name}`,
                        ).join("\n")
                      : "-"
                  }
                />
              </InfoRowAnimation>
            )}
            {data.dns &&
              Object.entries(data.dns.records)
                .filter(
                  ([type, records]) =>
                    records !== null &&
                    !["MX", "SRV"].includes(type) &&
                    Array.isArray(records) &&
                    records.every((item) => typeof item === "string"),
                )
                .map(([type, records]) => (
                  <InfoRowAnimation key={type}>
                    <InfoRow
                      label={type}
                      value={(records as string[]).join("\n")}
                    />
                  </InfoRowAnimation>
                ))}
          </motion.div>
        )}
        {data?.success &&
          filter === "WHOIS" &&
          (() => {
            const whoisData = data.whois;
            if (!whoisData || Object.keys(whoisData).length === 0) {
              return (
                <p className="text-red text-center">No Whois data available.</p>
              );
            }

            // Get all inner objects from whoisData
            const innerWhoisObjects = Object.values(whoisData);

            // Find the inner object with the most keys (the 'longest' one)
            const longestWhoisEntry = innerWhoisObjects.reduce(
              (prev, current) => {
                // Ensure prev and current are objects before checking keys
                const prevKeys =
                  typeof prev === "object" && prev !== null
                    ? Object.keys(prev).length
                    : 0;
                const currentKeys =
                  typeof current === "object" && current !== null
                    ? Object.keys(current).length
                    : 0;
                return prevKeys > currentKeys ? prev : current;
              },
            );

            return (
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
                }}
                key={`${filter}-${data}`}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-3"
              >
                {Object.entries(
                  longestWhoisEntry as Record<string, unknown>,
                ).map(([key, value]) => {
                  if (!value || key === "text" || key.includes(">>>")) return;
                  return (
                    <InfoRowAnimation>
                      <InfoRow
                        key={key}
                        label={key}
                        value={String(value).replace(/,/g, "\n")}
                      />
                    </InfoRowAnimation>
                  );
                })}
              </motion.div>
            );
          })()}
        {crtIsLoading && filter === "SSL" && (
          <div className="flex justify-center">
            <span className="loading bg-red loading-spinner h-12 w-12"></span>
          </div>
        )}
        {crtError && filter === "SSL" && (
          <p className="text-red text-center">{crtError.message}</p>
        )}
        {crtData && filter === "SSL" && (
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            key={`${filter}-${data}`}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-3"
          >
            {Array.from(
              new Map(
                crtData.map((item) => [item.issuer_ca_id, item]),
              ).values(),
            ).map((item) => (
              <InfoRowAnimation>
                <CrtRow
                  key={item.id}
                  issuerCaId={item.issuer_ca_id}
                  issuer_name={item.issuer_name}
                />
              </InfoRowAnimation>
            ))}
          </motion.div>
        )}
        {compInfoIsLoading && filter === "INFO" && (
          <div className="flex justify-center">
            <Loader />
          </div>
        )}
        {compInfoError && filter === "INFO" && (
          <p className="text-red text-center">{compInfoError.message}</p>
        )}
        {compInfo !== undefined && filter === "INFO" && (
          <CompanyInfoView data={compInfo.companyInfo} />
        )}
      </div>
    </div>
  );
}

function InfoRowAnimation({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
      }}
    >
      {children}
    </motion.div>
  );
}
