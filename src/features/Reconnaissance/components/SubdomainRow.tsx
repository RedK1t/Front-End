import { useState } from "react";
import openIcon from "../../../assets/openIcon.svg";
import PortItem from "./PortItem";

type SubdomainRowProps = {
  subdomain: string;
  ip: string;
};
export default function SubdomainRow({ subdomain, ip }: SubdomainRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    // Subdomain Item
    <div className="flex flex-col rounded-md bg-black px-4 py-2">
      {/*  Subdomain  */}
      <div className="flex items-center justify-between">
        {/* Subdomain Name & IP */}
        <div className="flex flex-col gap-1">
          <p className="normal-text text-red">{subdomain}</p>
          <p className="normal-text text-yellowish-white">{ip}</p>
        </div>

        {/* Subdomain Actions */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="small-text border-dark-red/50 shadow-dark-red/30 hover:shadow-dark-red/50 cursor-pointer rounded-md border bg-black px-2 py-1 shadow-[0_0_15px] outline-0"
          >
            Ports
          </button>
          <img src={openIcon} alt="open icon" className="h-6 w-6" />
        </div>
      </div>

      {/*  Ports */}
      <div
        className={`flex flex-wrap items-center justify-center gap-2 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1500px] py-3" : "max-h-0 py-0"}`}
      >
        {/* Port */}
        <PortItem port="80" protocol="HTTP" />
        <PortItem port="443" protocol="HTTPS" />
        <PortItem port="22" protocol="SSH" />
        <PortItem port="3306" protocol="MySQL" />
        <PortItem port="5432" protocol="PostgreSQL" />
        <PortItem port="21" protocol="FTP" />
      </div>
    </div>
  );
}
