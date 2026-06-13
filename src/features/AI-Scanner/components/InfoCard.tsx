import type { ReactNode } from "react";

type InfoCardProps = {
  title: string;
  value: string | number;
  icon: ReactNode;
  colorVariant?: "red" | "blue" | "green" | "orange" | "cyan";
};
export default function InfoCard({ 
  title, 
  value, 
  icon, 
  colorVariant = "red" 
}: InfoCardProps) {
  const colorClasses = {
    red: "border-red/30 hover:border-red/50 bg-red-transparent",
    blue: "border-blue/30 hover:border-blue/50 bg-blue-transparent",
    green: "border-green/30 hover:border-green/50 bg-green-transparent",
    orange: "border-orange/30 hover:border-orange/50 bg-orange-transparent",
    cyan: "border-cyan/30 hover:border-cyan/50 bg-cyan-transparent",
  };

  const valueColorClasses = {
    red: "text-light-red",
    blue: "text-blue",
    green: "text-green",
    orange: "text-orange",
    cyan: "text-cyan",
  };

  return (
    <div className={`flex w-full items-center justify-between rounded-xl border p-6 transition-all duration-300 ${colorClasses[colorVariant]}`}>
      <div className="flex flex-col gap-1">
        <p className="text-dark-yellowish-white small-text uppercase tracking-wider">{title}</p>
        <p className={`heading-text font-bold ${valueColorClasses[colorVariant]}`}>{value}</p>
      </div>
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-black/50 text-white/60">
        {icon}
      </div>
    </div>
  );
}
