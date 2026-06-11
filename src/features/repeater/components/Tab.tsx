import ContextMenuItemStyled from "@/components/ContextMenuItemStyled";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@radix-ui/react-context-menu";
import { IoClose } from "react-icons/io5";
import { useState, useRef, useEffect } from "react";

type TabProps = {
  text: string;
  isActive: boolean;
  onClose: () => void;
  onClick: () => void;
  onRename?: (newName: string) => void;
};

export default function Tab({
  text,
  isActive,
  onClose,
  onClick,
  onRename,
}: TabProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

  useEffect(() => {
    setRenameValue(text);
  }, [text]);

  const handleRenameSubmit = () => {
    if (onRename) {
      onRename(renameValue);
    }
    setIsRenaming(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRenameSubmit();
    } else if (e.key === "Escape") {
      setRenameValue(text);
      setIsRenaming(false);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          className={`${
            isActive ? "bg-red" : "bg-gray"
          } small-text rounded-6px flex cursor-pointer items-center gap-2 px-2 py-2 text-nowrap`}
          onClick={() => {
            if (!isRenaming) {
              onClick();
            }
          }}
        >
          {isRenaming ? (
            <input
              ref={inputRef}
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={handleKeyDown}
              className="text-yellowish-white w-fit border-none bg-transparent outline-none"
            />
          ) : (
            <span>{text}</span>
          )}
          <button
            className="hover:text-yellowish-white transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <IoClose />
          </button>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="bg-gray rounded-6px! small-text! text-yellowish-white! z-50! border-0! drop-shadow-lg drop-shadow-black/50">
        {onRename && (
          <ContextMenuItemStyled
            onClick={() => {
              setIsRenaming(true);
            }}
          >
            Rename tab
          </ContextMenuItemStyled>
        )}
        <ContextMenuItemStyled onClick={onClose}>
          Close tab
        </ContextMenuItemStyled>
      </ContextMenuContent>
    </ContextMenu>
  );
}
