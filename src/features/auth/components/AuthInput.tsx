import { motion } from "motion/react";
import { type ReactNode } from "react";

type AuthInputProps = {
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  icon: ReactNode;
  label: string;
  rightIcon?: ReactNode;
  className?: string;
  // Form-field identity so browsers / password managers map each field correctly
  // (without these, the email box is treated as a generic username field).
  name?: string;
  id?: string;
  autoComplete?: string;
};

export default function AuthInput({
  type,
  placeholder,
  value,
  onChange,
  error,
  icon,
  label,
  rightIcon,
  className = "",
  name,
  id,
  autoComplete,
}: AuthInputProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block">
        <span className="small-text text-yellowish-white font-medium">
          {label}
        </span>
      </label>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
          {icon}
        </div>
        <input
          type={type}
          name={name}
          id={id}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`focus:ring-dark-red w-full rounded-xl border bg-black py-4 pr-12 pl-12 text-white transition-all duration-200 placeholder:text-white/40 focus:border-transparent focus:ring-2 focus:outline-none ${error ? "border-red" : "border-red-transparent"} hover:border-light-red/50`}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="small-text text-red ml-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
