import { MdKeyboardArrowDown } from "react-icons/md";
import openIcon from "@/assets/openIcon.svg";
import useGetOpenPorts from "@/features/Reconnaissance/hooks/useGetOpenPorts";
import { useState } from "react";
import Loader from "@/components/Loader";
import { useNavigate } from "react-router-dom";
import { useDomain } from "@/context/DomainContext";
import { FaPlay } from "react-icons/fa";

type SubdomainRowProps = {
  data: {
    subdomain: string;
    ips: string[];
    status?: number;
    url?: string;
  };
};
export default function SubdomainRow({ data }: SubdomainRowProps) {
  const { ips, url, subdomain } = data;
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { setSelectedSubdomain } = useDomain();

  const handleSitemapClick = () => {
    setSelectedSubdomain(subdomain);
    navigate("/proxy/sitemap/standard");
  };

  const {
    data: openPorts,
    isLoading,
    error,
  } = useGetOpenPorts(data.subdomain, isOpen);
  return (
    <div className="normal-text rounded-6px flex flex-col bg-black/40 px-2 py-3">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <p className="text-light-red font-bold">{subdomain}</p>
          <p className="text-dark-yellowish-white text-[10px]">{ips[0]}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSitemapClick}
            className="small-text bg-red hover:bg-light-red flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 font-bold tracking-wider text-white uppercase transition-all hover:shadow-[0_0_15px_rgba(206,50,50,0.5)] active:scale-95"
          >
            <FaPlay className="h-2.5 w-2.5" />
            TEST
          </button>

          <div className="flex items-center gap-2 border-l border-white/10 pl-3">
            {url && (
              <a
                href={url}
                className="rounded-md p-1 transition-colors hover:bg-white/5"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={openIcon}
                  alt="open icon"
                  className="h-4 w-4 invert dark:invert-0"
                />
              </a>
            )}
            <button
              className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-all hover:bg-white/5 ${isOpen ? "text-red rotate-180" : "text-dark-yellowish-white"}`}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <MdKeyboardArrowDown className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      <div
        className={`flex flex-col gap-2 px-1 ${isOpen ? "max-h-375 pt-2" : "max-h-0 pt-0"} overflow-hidden transition-all duration-300`}
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
