import { ContextMenuItem } from "@radix-ui/react-context-menu";
import type { ReactNode } from "react";

export default function ContextMenuItemStyled({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <ContextMenuItem
      onClick={onClick}
      className="hover:bg-dark-red/40! rounded-6px text-yellowish-white! min-w-44 cursor-pointer px-3 py-1 focus-visible:outline-0"
    >
      {children}
    </ContextMenuItem>
  );
}
