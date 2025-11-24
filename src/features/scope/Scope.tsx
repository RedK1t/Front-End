import ExclusionPanel from "./components/ExclusionPanel";
import TargetPanel from "./components/TargetPanel";
export default function Scope() {
  return (
    <div className="mx-auto flex h-screen w-11/12 flex-col items-center justify-between gap-12 py-7 lg:max-h-screen lg:flex-row">
      {/* left panel */}
      <TargetPanel />
      {/* right panel */}
      <ExclusionPanel />
    </div>
  );
}
