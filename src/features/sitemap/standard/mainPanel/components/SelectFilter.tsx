import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MdCancel } from "react-icons/md";
import { useSearchParams } from "react-router-dom";

type SelectFilterProps = {
  placeholder: string;
  options: string[];
};

export default function SelectFilter({
  placeholder,
  options,
}: SelectFilterProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <div className="bg-gray flex items-center rounded-md pl-2">
      {/* SelectFilter Clear Button */}
      <MdCancel
        onClick={(e) => {
          e.preventDefault();
          const newParams = new URLSearchParams(searchParams);
          newParams.delete(placeholder);
          setSearchParams(newParams, { replace: true });
        }}
        className="cursor-pointer text-white/50"
      />

      {/* SelectFilter */}
      <Select
        value={searchParams.get(placeholder) || ""}
        onValueChange={(value) => {
          // Set Filter to Search Params
          const newParams = new URLSearchParams(searchParams);
          newParams.set(placeholder, value);
          setSearchParams(newParams, { replace: true });
        }}
      >
        {/* SelectFilter Trigger */}
        <SelectTrigger className="bg-gray small-text min-w-[100px] border-0 text-white">
          <SelectValue placeholder={placeholder}></SelectValue>
        </SelectTrigger>
        {/* SelectFilter Content */}
        <SelectContent className="bg-gray small-text min-w-[100px] border-0 text-white">
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
