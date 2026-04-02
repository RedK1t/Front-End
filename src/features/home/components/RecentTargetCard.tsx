import { updateTarget } from "@/api/supabase";
import { useDomain } from "@/context/DomainContext";
import type { RecentTarget } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { motion } from "motion/react";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

type RecentTargetCardProps = {
  targetName: string;
  targetDomain: string;
  lastScanned: string;
};

const LOGO_DEV_PUBLIC_KEY = import.meta.env.VITE_LOGO_DEV_PUBLIC_KEY;

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
  lastScanned,
}: RecentTargetCardProps) {
  const { setDomain } = useDomain();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

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
            <p className="heading-text text-white">
              {targetName?.charAt(0)?.toUpperCase() + targetName?.slice(1)}
            </p>
            <p className="normal-text text-yellowish-white">{targetDomain}</p>
          </div>
          {/* Header Icon */}
          <CompanyLogo domain={targetDomain} />
        </div>

        {/* Content */}
        <div className="flex justify-between">
          <div className="flex flex-col gap-1 text-start">
            <p className="normal-text">Last Scanned</p>
            <p className="normal-text text-red">
              {formatDistanceToNow(new Date(lastScanned), {
                addSuffix: true,
              })}
            </p>
          </div>

          {/* Content Right */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setDomain(targetDomain);
                navigate(`/reconnaissance`);
                updateTarget(targetDomain);
                queryClient.setQueryData(
                  ["targets"],
                  (oldData: RecentTarget[]) => {
                    return oldData?.map((item) => {
                      if (item.domain === targetDomain) {
                        return {
                          ...item,
                          created_at: new Date().toISOString(),
                        };
                      }
                      return item;
                    });
                  },
                );
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
