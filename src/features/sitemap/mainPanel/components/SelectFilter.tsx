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
      <MdCancel
        onClick={(e) => {
          e.preventDefault();
          const newParams = new URLSearchParams(searchParams);
          newParams.delete(placeholder);
          setSearchParams(newParams);
        }}
        className="cursor-pointer text-white/50"
      />
      <Select
        value={searchParams.get(placeholder) || ""}
        onValueChange={(value) => {
          if (value === searchParams.get(placeholder)) {
            searchParams.delete(placeholder);
          }
          console.log(searchParams);
          const newParams = new URLSearchParams(searchParams);
          newParams.set(placeholder, value);
          setSearchParams(newParams);
        }}
      >
        <SelectTrigger className="bg-gray small-text min-w-[100px] border-0 text-white">
          <SelectValue placeholder={placeholder}></SelectValue>
        </SelectTrigger>
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
