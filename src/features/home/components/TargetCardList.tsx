import type { RecentScannedSubdomains } from "@/features/types";
import TargetCard from "./TargetCard";

export default function TargetCardList() {
  const raw = localStorage.getItem("scannedSubdomains");
  const scannedSubdomains: RecentScannedSubdomains = JSON.parse(raw || "[]");
  return (
    <div className="mx-auto mt-14 flex w-full flex-wrap items-center justify-center gap-4 pb-14 md:w-11/12 lg:justify-start xl:w-10/12">
      <TargetCard isNew={true} />
      {scannedSubdomains.map((item) => (
        <TargetCard
          key={item.targetDomain}
          targetName={
            item.targetDomain.split(".")[
              item.targetDomain.split(".").length - 2
            ]
          }
          targetDomain={item.targetDomain}
          vulnerabilitiesFound={item.vulnerabilitiesFound}
          lastScanned={item.lastScanned}
        />
      ))}
    </div>
  );
}
