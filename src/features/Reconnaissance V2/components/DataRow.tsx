import { useState, type ReactNode } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

type DataRowProps = {
  label: string;
  value: string | string[] | number;
  rowList?: (string | number)[][];
  children?: ReactNode; // this will be used for custom inner lists
};
export default function DataRow({
  label,
  value,
  rowList,
  children,
}: DataRowProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (Array.isArray(value) && value.length > 1)
    return (
      <div className="rounded-6px flex flex-col gap-y-1 bg-black/40 px-2 py-3">
        <p className="normal-text text-light-red">{label}</p>
        <div className="flex flex-col gap-y-1.5">
          {value.map((item, index) => (
            <>
              <p
                key={index}
                className="normal-text text-dark-yellowish-white pl-3 text-wrap break-all"
              >
                {item}
              </p>
            </>
          ))}
        </div>
      </div>
    );
  if (Array.isArray(value) && value.length === 1)
    return (
      <div className="rounded-6px flex items-center justify-between bg-black/40 px-2 py-3">
        <p className="normal-text text-light-red">{label}</p>
        <p className="normal-text text-dark-yellowish-white pl-3 text-end text-wrap break-all">
          {value[0]}
        </p>
      </div>
    );
  if (typeof value === "string" || typeof value === "number")
    return (
      <div className="rounded-6px flex flex-col gap-y-1 bg-black/40 px-2 py-3">
        <div className="flex items-center justify-between gap-2">
          <p className="normal-text text-light-red text-wrap">{label}</p>
          <div className="flex items-center gap-1">
            <p className="normal-text text-dark-yellowish-white text-end text-wrap break-all">
              {value}
            </p>
            {(rowList || children) && (
              <button
                className="h-5 w-5 cursor-pointer"
                onClick={() => setIsOpen((prev) => !prev)}
              >
                <MdKeyboardArrowDown className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
        <div
          className={`flex flex-col gap-2 px-1 ${isOpen ? "max-h-[1500px] pt-2" : "max-h-0 pt-0"} overflow-hidden transition-all duration-300`}
        >
          {rowList?.map((data) => (
            <div className="normal-text text-dark-yellowish-white bg-dark-yellowish-white/10 rounded-6px flex items-center justify-between px-2 py-1">
              <p>{data[0]}</p>
              <p>{data[1]}</p>
            </div>
          ))}

          {children}
        </div>
      </div>
    );
}
