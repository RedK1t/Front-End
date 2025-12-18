import { useSearchParams } from "react-router-dom";
import copyIcon from "../../../assets/copyIcon.svg";
import exportIcon from "../../../assets/ExportIcon.svg";
import InfoRow from "./InfoRow";
import useWhoisDnsRecords from "../hooks/useWhoisDnsRecords";

export default function DomainInfoPanel() {
  const [searchParams] = useSearchParams();
  const domain = searchParams.get("domain");
  const { data, error, isLoading } = useWhoisDnsRecords(domain || "");
  console.log(data);
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
        {isLoading && (
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
            <InfoRow
              label="A"
              value={data.dns?.records?.A?.join("\n") || "-"}
            />

            <InfoRow
              label="AAAA"
              value={data.dns?.records?.AAAA?.join("\n") || "-"}
            />
            <InfoRow
              label="MX"
              value={
                data.dns?.records?.MX?.map(
                  (mx) => `Priority ${mx.priority} - ${mx.exchange}`,
                ).join("\n") || "\n"
              }
            />
            <InfoRow
              label="NS"
              value={data.dns?.records?.NS?.join("\n") || "-"}
            />
            <InfoRow
              label="TXT"
              value={data.dns?.records?.TXT.flat().flat().join("\n") || "\n"}
            />
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
                {Object.entries(longestWhoisEntry).map(([key, value]) => {
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
      </div>
    </div>
  );
}
