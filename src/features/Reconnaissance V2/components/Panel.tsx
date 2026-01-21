import refetch from "@/assets/refetch.svg";
import type { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";
type PanelFilterProps = {
  filter: string;
  options: string[];
};
type PanelNoFilterProps = {
  filter?: undefined;
  options?: undefined;
};
type PanelProps = (PanelFilterProps | PanelNoFilterProps) & {
  title: string;
  children: ReactNode;
};

export default function Panel({
  title,
  children,
  filter,
  options,
}: PanelProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get(filter || "") || options?.[0];
  return (
    <div className="bg-gray rounded-6px text-dark-yellowish-white flex h-full max-h-150 w-md flex-col gap-2 overflow-auto p-3">
      {/*Header */}
      <div className="flex items-center justify-between">
        <p className="text-light-red large-text">{title}</p>
        <div className="flex items-center gap-2">
          {options?.map((option) => (
            <StyledButton
              key={option}
              $isSelected={currentFilter === option}
              className={`cursor-pointer ${
                currentFilter === option
                  ? "text-yellowish-white"
                  : "text-dark-yellowish-white"
              }`}
              onClick={() => {
                const newSearchParams = new URLSearchParams(searchParams);
                newSearchParams.set(filter, option);
                setSearchParams(newSearchParams);
              }}
            >
              {option}
            </StyledButton>
          ))}
          <button className="cursor-pointer" title="Refetch">
            <img src={refetch} alt="refetch" className="h-4 w-4" />
          </button>
        </div>
      </div>
      {/* Data */}
      <div className="flex h-full w-full flex-col gap-y-2">{children}</div>
    </div>
  );
}

const StyledButton = styled.button<{ $isSelected: boolean }>`
  position: relative;
  padding: 4px 0;
  transition: color 0.3s ease;

  &::after {
    content: "";
    position: absolute;
    bottom: 0px;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #d7ccbc; /* yellowish-white color */
    transform: ${(props) => (props.$isSelected ? "scaleX(1)" : "scaleX(0)")};
    transform-origin: center;
    transition: transform 0.3s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;
