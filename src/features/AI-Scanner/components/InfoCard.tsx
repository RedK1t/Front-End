import type { ReactNode } from "react";

type InfoCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
};
export default function InfoCard({ title, value, icon }: InfoCardProps) {
  return (
    <div className="bg-gray flex w-full items-center justify-between rounded-xl p-4">
      <div className="flex flex-col">
        <p className="text-dark-yellowish-white normal-text">{title}</p>
        <p className="heading-text text-light-red">{value}</p>
      </div>
      {icon}
    </div>
  );
}
