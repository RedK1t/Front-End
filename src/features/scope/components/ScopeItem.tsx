import { LuTrash2 } from "react-icons/lu";

type ScopeItemProps = {
  scope: string;
  deleteScope: (string: string) => void;
};
export default function ScopeItem({ scope, deleteScope }: ScopeItemProps) {
  return (
    <div className="rounded-6px flex w-full items-center justify-between bg-black px-4 py-3">
      <p className="text-yellowish-white normal-text">{scope}</p>
      <LuTrash2
        className="text-red h-5 w-5 cursor-pointer"
        onClick={() => deleteScope(scope)}
      />
    </div>
  );
}
