import { MdKeyboardArrowDown } from "react-icons/md";
import openIcon from "@/assets/openIcon.svg";
import useGetOpenPorts from "@/features/Reconnaissance/hooks/useGetOpenPorts";
import { useState } from "react";
import Loader from "@/components/Loader";
type SubdomainRowProps = {
  data: {
    subdomain: string;
    ips: string[];
    status?: number;
    url?: string;
  };
};
export default function SubdomainRow({ data }: SubdomainRowProps) {
  const { data: openPorts, isLoading, error } = useGetOpenPorts(data.subdomain);
  const [isOpen, setIsOpen] = useState(false);
  const { ips, url, subdomain } = data;
  return (
    <div className="normal-text rounded-6px flex flex-col bg-black/40 px-2 py-3">
      <div className="flex items-center justify-between">
        <p className="text-light-red">{subdomain}</p>

        <div className="flex items-center gap-1">
          <p className="text-dark-yellowish-white">{ips[0]}</p>
          {url && (
            <a
              href={url}
              className="h-4 w-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={openIcon} alt="open icon" />
            </a>
          )}
          <button
            className="h-5 w-5 cursor-pointer"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <MdKeyboardArrowDown className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div
        className={`flex flex-col gap-2 px-1 ${isOpen ? "max-h-[1500px] pt-2" : "max-h-0 pt-0"} overflow-hidden transition-all duration-300`}
      >
        {openPorts?.state === "up" && (
          <>
            {openPorts?.ports?.map((port) => (
              <div className="normal-text text-dark-yellowish-white bg-dark-yellowish-white/10 rounded-6px flex items-center justify-between px-2 py-1">
                <p>{port.protocol}</p>
                <p>{port.port}</p>
              </div>
            ))}
          </>
        )}
        {error && (
          <div className="flex items-center justify-center">
            <p className="text-red-500">{error.message}</p>
          </div>
        )}
        {isLoading && (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
}
