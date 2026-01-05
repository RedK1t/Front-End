import ContextMenuItemStyled from "@/components/ContextMenuItemStyled";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@radix-ui/react-context-menu";

type TabProps = {
  text: string;
};

export default function Tab({ text }: TabProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="bg-gray small-text rounded-6px flex cursor-pointer items-center px-2 py-2 text-nowrap">
        {text}
      </ContextMenuTrigger>
      <ContextMenuContent className="bg-gray rounded-6px! small-text! text-yellowish-white! z-50! border-0! drop-shadow-lg drop-shadow-black/50">
        <ContextMenuItemStyled>Rename tab</ContextMenuItemStyled>
        <ContextMenuItemStyled>Close tab</ContextMenuItemStyled>
        <ContextMenuItemStyled>Close other tabs</ContextMenuItemStyled>
        <ContextMenuItemStyled>Close tabs to the left</ContextMenuItemStyled>
        <ContextMenuItemStyled>Close tabs to the right</ContextMenuItemStyled>
      </ContextMenuContent>
    </ContextMenu>
  );
}
