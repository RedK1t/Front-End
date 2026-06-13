import { deleteTarget, updateTarget } from "@/api/supabase";
import { useDomain } from "@/context/DomainContext";
import type { RecentTarget } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { motion } from "motion/react";
import { FaArrowRight, FaTrash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import toast from "react-hot-toast";

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
  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  const queryClient = useQueryClient();

  const handleDelete = async () => {
    toast.promise(
      deleteTarget(targetDomain).then(() => {
        queryClient.setQueryData(["targets"], (oldData: RecentTarget[]) => {
          return oldData?.filter((item) => item.domain !== targetDomain);
        });
        queryClient.invalidateQueries({ queryKey: ["targets"] });
      }),
      {
        loading: "Deleting target...",
        success: "Target deleted successfully!",
        error: "Failed to delete target",
      },
    );
    deleteDialogRef.current?.close();
  };

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
          <div className="flex items-end gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteDialogRef.current?.showModal();
              }}
              className="small-text group border-gray/50 hover:border-red/60 hover:bg-red/10 flex cursor-pointer items-center gap-1 rounded-lg border bg-black/10 px-3 py-1.5 text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
            >
              <FaTrash />
            </button>
            <button
              onClick={async () => {
                setDomain(targetDomain);
                navigate(`/reconnaissance`);
                await updateTarget(targetDomain).then(() => {
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
                });
              }}
              className="small-text group border-red/30 hover:border-red/60 hover:bg-red/10 flex cursor-pointer items-center gap-1 rounded-lg border bg-black/10 px-3 py-1.5 text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_10px_rgba(206,50,50,0.3)] active:scale-95"
            >
              Manage
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <dialog ref={deleteDialogRef} className="modal backdrop-blur-sm">
        <div className="modal-box bg-gray/95 relative max-w-md overflow-hidden rounded-2xl border border-white/10 p-0 shadow-2xl backdrop-blur-xl">
          <div className="via-red absolute top-0 left-0 h-0.5 w-full bg-linear-to-r from-transparent to-transparent opacity-50" />

          <div className="flex flex-col gap-6 p-8">
            <div className="text-center">
              <h3 className="heading-text text-white">Delete Target</h3>
              <p className="normal-text mt-2 text-white/50">
                Are you sure you want to delete{" "}
                <span className="text-red">{targetDomain}</span>? This action
                cannot be undone.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                onClick={() => deleteDialogRef.current?.close()}
                className="normal-text flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-white/60 transition-all duration-300 hover:border-white/20 hover:bg-white/5 hover:text-white active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red shadow-red/20 hover:bg-light-red hover:shadow-red/40 mid-text flex cursor-pointer items-center justify-center gap-2 rounded-xl py-3 text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        <form
          method="dialog"
          className="modal-backdrop bg-black/60 backdrop-blur-sm"
        >
          <button>close</button>
        </form>
      </dialog>
    </motion.div>
  );
}
