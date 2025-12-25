import { useSearchParams } from "react-router-dom";
import copyIcon from "../../../assets/copyIcon.svg";
import exportIcon from "../../../assets/ExportIcon.svg";
import InfoRow from "./InfoRow";
import useWhoisDnsRecords from "../hooks/useWhoisDnsRecords";
import useGetCrt from "../hooks/useGetCrt";
import CrtRow from "./CrtRow";
import { useDomain } from "@/context/DomainContext";

export default function DomainInfoPanel() {
  const [searchParams] = useSearchParams();
  const { domain } = useDomain();
  const { data, error, isLoading } = useWhoisDnsRecords(domain || "");
  const {
    data: crtData,
    isLoading: crtIsLoading,
    error: crtError,
  } = useGetCrt(domain || "");

  const filter = searchParams.get("dig");
  return (
    /*  Panel */
    <div className="bg-gray flex h-[80dvh] w-full flex-col gap-y-10 rounded-md px-6 py-6 lg:w-1/2">
      {/*  Header */}
      <div className="flex w-full items-center justify-between">
        <p className="large-text text-white">{filter} information</p>

        {/*  Header Buttons */}
        <div className="flex items-center gap-2">
          <button className="bg-gray normal-text border-dark-yellowish-white flex cursor-pointer gap-3.5 rounded-md border px-2.5 py-2">
            <img src={copyIcon} alt="copy icon" />
            Copy
          </button>
          <button className="bg-gray normal-text border-dark-yellowish-white flex cursor-pointer gap-3.5 rounded-md border px-2.5 py-2">
            <img src={exportIcon} alt="export icon" />
            Export
          </button>
        </div>
      </div>

      {/*  Domain Info */}
      <div className="flex flex-col gap-3 overflow-y-auto">
        {isLoading && (filter === "Dns" || filter === "Whois") && (
          <div className="flex justify-center">
            <span className="loading bg-red loading-spinner h-12 w-12"></span>
          </div>
        )}
        {error && <p className="text-red text-center">{error.message}</p>}
        {!data?.success && (
          <p className="text-red text-center">{data?.error}</p>
        )}
        {data?.success && filter === "Dns" && (
          <>
            {data.dns?.records.MX && (
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
            )}
            {data.dns?.records.SRV && (
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
                  <InfoRow
                    key={type}
                    label={type}
                    value={(records as string[]).join("\n")}
                  />
                ))}
          </>
        )}
        {data?.success &&
          filter === "Whois" &&
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
              <>
                {Object.entries(
                  longestWhoisEntry as Record<string, unknown>,
                ).map(([key, value]) => {
                  if (!value || key === "text" || key.includes(">>>")) return;
                  return (
                    <InfoRow
                      key={key}
                      label={key}
                      value={String(value).replace(/,/g, "\n")}
                    />
                  );
                })}
              </>
            );
          })()}
        {crtIsLoading && filter === "Ssl" && (
          <div className="flex justify-center">
            <span className="loading bg-red loading-spinner h-12 w-12"></span>
          </div>
        )}
        {crtError && filter === "Ssl" && (
          <p className="text-red text-center">{crtError.message}</p>
        )}
        {crtData && filter === "Ssl" && (
          <>
            {Array.from(
              new Map(
                crtData.map((item) => [item.issuer_ca_id, item]),
              ).values(),
            ).map((item) => (
              <CrtRow
                key={item.id}
                issuerCaId={item.issuer_ca_id}
                issuer_name={item.issuer_name}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
