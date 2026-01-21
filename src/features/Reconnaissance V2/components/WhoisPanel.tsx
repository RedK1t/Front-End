import useWhoisDnsRecords from "@/features/Reconnaissance/hooks/useWhoisDnsRecords";
import Panel from "./Panel";
import DataRow from "./DataRow";
import Loader from "@/components/Loader";

export default function WhoisPanel() {
  const { data, error, isLoading } = useWhoisDnsRecords();

  return (
    <Panel title="WHOIS">
      {error && (
        <div className="flex items-center justify-center">
          <p className="text-red-500">{error.message}</p>
        </div>
      )}
      {isLoading && (
        <div className="flex items-center justify-center">
          <Loader />
        </div>
      )}
      {data?.success &&
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
            <div className="flex flex-col gap-3">
              {Object.entries(longestWhoisEntry as Record<string, unknown>).map(
                ([key, value]) => {
                  if (!value || key === "text" || key.includes(">>>")) return;
                  return (
                    <DataRow
                      key={key}
                      label={key}
                      value={String(value).replace(/,/g, "\n")}
                    />
                  );
                },
              )}
            </div>
          );
        })()}
    </Panel>
  );
}
