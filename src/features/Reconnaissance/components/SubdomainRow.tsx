import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDomain } from "../../../context/DomainContext";
import openIcon from "../../../assets/openIcon.svg";
import PortItem from "./PortItem";
import useGetOpenPorts from "../hooks/useGetOpenPorts";
import { FaPlay } from "react-icons/fa";
import Loader from "@/components/Loader";
import { motion } from "motion/react";

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
  const { setSelectedSubdomain } = useDomain();
  const navigate = useNavigate();
  const { data, isLoading } = useGetOpenPorts(subdomain, isOpen);

  const handleSitemapClick = () => {
    setSelectedSubdomain(subdomain);
    navigate("/proxy/sitemap/standard");
  };
  return (
    // Subdomain Item — slide-in-from-left + stagger, matching the WHOIS rows.
    <motion.div
      variants={{
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 },
      }}
      className="flex flex-col rounded-md bg-black px-4 py-2"
    >
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
        <div className="flex w-5/12 items-center justify-end gap-3">
          <button
            onClick={handleSitemapClick}
            className="small-text bg-red hover:bg-light-red flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 font-bold tracking-wider text-white uppercase transition-all hover:shadow-[0_0_20px_rgba(206,50,50,0.6)] active:scale-95"
          >
            <FaPlay className="h-3 w-3" />
            TEST
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="small-text text-dark-yellowish-white hover:border-red/30 hover:text-red cursor-pointer rounded-md border border-white/5 bg-white/5 px-3 py-2 transition-all active:scale-95"
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
            <Loader />
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
    </motion.div>
  );
}
