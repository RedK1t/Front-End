import type { ReactNode } from "react";

type TrProps = {
  left?: boolean;
  right?: boolean;
  children: ReactNode;
};

export default function Td({ left, right, children }: TrProps) {
  return (
    <td
      className={`cursor-pointer px-2 py-1 text-start ${left ? "rounded-l-6px" : right ? "rounded-r-6px" : ""}`}
    >
      {children}
    </td>
  );
}
