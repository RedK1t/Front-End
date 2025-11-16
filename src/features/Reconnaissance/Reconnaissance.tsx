import DomainInfoPanel from "./components/DomainInfoPanel";
import Filters from "./components/Filters";
import SubdomainsPanel from "./components/SubdomainsPanel";

export default function Reconnaissance() {
  return (
    <div className="flex flex-col gap-5">
      <Filters />
      <div className="mx-auto flex w-11/12 items-center justify-between gap-16">
        <DomainInfoPanel />
        <SubdomainsPanel />
      </div>
    </div>
  );
}
