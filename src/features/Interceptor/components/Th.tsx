import type { ReactNode } from "react";

type ThProps = {
  children: ReactNode;
  left?: boolean;
  right?: boolean;
};
export default function Th({ children, left, right }: ThProps) {
  return (
    <th
      className={`hover:bg-yellowish-white/15 cursor-pointer px-2 py-1 text-start transition-all duration-200 ${left ? "rounded-l-[4px]" : right ? "rounded-r-[4px]" : ""}`}
    >
      {children}
    </th>
  );
}
