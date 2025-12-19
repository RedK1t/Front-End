import { useState } from "react";
import openIcon from "../../../assets/openIcon.svg";
import PortItem from "./PortItem";
import useGetOpenPorts from "../hooks/useGetOpenPorts";

type SubdomainRowProps = {
  subdomain: string;
  ip: string;
  status?: number;
  url?: string;
};
export default function SubdomainRow({
  subdomain,
  ip,
  status,
  url,
}: SubdomainRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { data, isLoading, error } = useGetOpenPorts(subdomain);
  console.log(error);
  return (
    // Subdomain Item
    <div className="flex flex-col rounded-md bg-black px-4 py-2">
      {/*  Subdomain  */}
      <div className="flex items-center justify-between">
        {/* Subdomain Name & IP */}
        <div className="flex max-w-10/12 flex-col gap-1">
          <div className="flex w-48 items-center justify-between">
            <p className="normal-text text-red">{subdomain}</p>
            {status && (
              <p
                className={`small-text border-green/50 ${status === 200 ? "text-green/80" : "text-red"}`}
              >
                {status}
              </p>
            )}
          </div>
          <p className="normal-text text-yellowish-white text-wrap">{ip}</p>
        </div>

        {/* Subdomain Actions */}
        <div className="flex w-2/12 items-center justify-between">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="small-text border-dark-red/50 shadow-dark-red/30 hover:shadow-dark-red/50 cursor-pointer rounded-md border bg-black px-2 py-1 shadow-[0_0_15px] outline-0"
          >
            Ports
          </button>
          {url && (
            <a
              href={url}
              className="h-6 w-6"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={openIcon} alt="open icon" className="h-6 w-6" />
            </a>
          )}
        </div>
      </div>

      {/*  Ports */}
      <div
        className={`flex flex-col flex-wrap items-center justify-center gap-2 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1500px] py-3" : "max-h-0 py-0"}`}
      >
        {/* Port */}
        {isLoading && (
          <div className="flex justify-center">
            <span className="loading bg-red loading-spinner h-12 w-12"></span>
          </div>
        )}
        {!isLoading &&
          data &&
          data.state === "up" &&
          data.ports.map((portData) => (
            <PortItem
              key={portData.port}
              port={portData.port}
              protocol={portData.protocol}
              state={portData.state}
              service={portData.service}
              serviceVersion={portData.service_version}
            />
          ))}
      </div>
    </div>
  );
}
