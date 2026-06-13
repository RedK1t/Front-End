import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme, type Theme } from "@/context/ThemeContext";

const options: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

export default function ThemeToggle({ isOpen }: { isOpen: boolean }) {
  const { theme, setTheme } = useTheme();

  // Collapsed sidebar: a single icon button that cycles light → dark → system.
  if (!isOpen) {
    const current = options.find((o) => o.value === theme) ?? options[2];
    const Icon = current.Icon;
    const cycle = () => {
      const idx = options.findIndex((o) => o.value === theme);
      setTheme(options[(idx + 1) % options.length].value);
    };
    return (
      <button
        onClick={cycle}
        title={`Theme: ${current.label} (click to change)`}
        className="hover:bg-red flex h-10 w-10 items-center justify-center rounded-lg text-white transition-all duration-200"
      >
        <Icon className="h-4 w-4" />
      </button>
    );
  }

  // Expanded sidebar: a segmented 3-way control.
  return (
    <div className="bg-yellowish-white/8 flex w-full items-center gap-1 rounded-lg p-1">
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          title={label}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 transition-all duration-200 ${
            theme === value
              ? "bg-red shadow-red/30 text-[#fff] shadow-[0_0_15px]"
              : "text-yellowish-white hover:bg-white/10"
          }`}
        >
          <Icon className="h-4 w-4" />
          <span className="small-text">{label}</span>
        </button>
      ))}
    </div>
  );
}
