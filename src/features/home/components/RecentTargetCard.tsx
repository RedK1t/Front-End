import { useDomain } from "@/context/DomainContext";
import uparrowIcon from "../../../assets/uparrowIcon.svg";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { FaArrowRight } from "react-icons/fa6";

type RecentTargetCardProps = {
  targetName: string;
  targetDomain: string;
  vulnerabilitiesFound: number;
  lastScanned: string;
};

const LOGO_DEV_PUBLIC_KEY = "pk_e6MtMO_tQm6SnFDQtPovWg";
function CompanyLogo({ domain }: { domain: string }) {
  return (
    <img
      src={`https://img.logo.dev/${domain}?token=${LOGO_DEV_PUBLIC_KEY}&format=png&retina=true&theme=dark`}
      alt="Company logo"
      className="h-12 w-12 rounded-full"
    />
  );
}
export default function RecentTargetCard({
  targetName,
  targetDomain,
  vulnerabilitiesFound,
  lastScanned,
}: RecentTargetCardProps) {
  const { setDomain } = useDomain();
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{
        scale: 0.7,
        opacity: 0.8,
      }}
      whileInView={{
        scale: 1,
        opacity: 1,
        transition: {
          type: "spring",
          duration: 1,
        },
      }}
      viewport={{ once: true }}
    >
      <div className="bg-gray/80 flex h-52 w-72 flex-col justify-between rounded-[14px] p-4 transition-all duration-300 hover:-translate-y-1">
        {/* Header */}
        <div className="flex items-center justify-between">
          {/* Header Content */}
          <div className="flex flex-col">
            <p className="heading-text text-white">{targetName}</p>
            <p className="normal-text text-yellowish-white">{targetDomain}</p>
          </div>
          {/* Header Icon */}
          <CompanyLogo domain={targetDomain} />
        </div>

        {/* Content */}
        <div className="flex justify-between">
          {/* Content Left */}
          <div className="flex w-1/2 flex-col gap-2">
            <p className="normal-text text-white">Vulnerabilities Found</p>
            <div className="flex items-end">
              <p className="heading-text text-red text-shadow-red text-shadow-[0_0_24px_rgba(255,0,0,1)]">
                {vulnerabilitiesFound}
              </p>
              <img
                src={uparrowIcon}
                alt="Up Arrow Icon"
                className="h-5 w-5 -translate-y-1/4"
              />
            </div>
          </div>
          {/* Content Right */}
          <div className="flex flex-col items-end justify-between">
            <div className="flex flex-col gap-1 text-end">
              <p className="normal-text">Last Scanned</p>
              <p className="normal-text text-red">
                {formatDistanceToNow(new Date(lastScanned), {
                  addSuffix: true,
                })}
              </p>
            </div>
            <button
              onClick={() => {
                setDomain(targetDomain);
                navigate(`/reconnaissance`);
              }}
              className="small-text group border-red/30 hover:border-red/60 hover:bg-red/10 flex cursor-pointer items-center gap-1 rounded-lg border bg-black/10 px-3 py-1.5 text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_10px_rgba(206,50,50,0.3)] active:scale-95"
            >
              Manage
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
