import type { ReactNode } from "react";

type TrProps = {
  left?: boolean;
  right?: boolean;
  children: ReactNode;
};

export default function Td({ left, right, children }: TrProps) {
  return (
    <td
      className={`cursor-pointer px-2 py-1 text-start ${left ? "rounded-l-[4px]" : right ? "rounded-r-[4px]" : ""}`}
    >
      {children}
    </td>
  );
}
