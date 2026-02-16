import { Input } from "@/components/ui/input";
import type { ReactNode } from "react";

type InputFieldProps = {
  label: string;
  placeholder: string;
  icon: ReactNode;
  value: string;
  onChange: (value: string) => void;
};

export default function InputField({
  label,
  placeholder,
  icon,
  value,
  onChange,
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="normal-text text-dark-yellowish-white flex items-center gap-2">
        {icon}
        {label}
      </label>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="text-yellowish-white placeholder:text-dark-yellowish-white/60 focus-visible:ring-red/40 border-0 bg-black/40"
      />
    </div>
  );
}
