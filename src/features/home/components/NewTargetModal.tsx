import { Link, useNavigate } from "react-router-dom";
import { IoIosSearch } from "react-icons/io";
import searchIcon from "../../../assets/SearchIcon.svg";
import shareIcon from "../../../assets/ShareIcon.svg";
import BinaryToggle from "@/components/BinaryToggle";
import { useState } from "react";
import { useDomain } from "@/context/DomainContext";
import { useSubdomainContext } from "@/context/SubdomainContext";
import { insertNewTarget } from "@/api/supabase";
import { useQueryClient } from "@tanstack/react-query";

export default function NewTargetModal() {
  const [domainInput, setDomainInput] = useState("");
  const navigate = useNavigate();

  const { setDomain } = useDomain();
  const { scanSubdomains, setScanSubdomains } = useSubdomainContext();

  const queryClient = useQueryClient();

  async function handleSubmit(e: React.KeyboardEvent<HTMLInputElement>) {
    e.preventDefault();
    setDomain(domainInput);
    navigate(`/reconnaissance`);
    await insertNewTarget(domainInput).then(() =>
      queryClient.refetchQueries({ queryKey: ["targets"] }),
    );
  }
  return (
    <dialog id="addTargetModal" className="modal backdrop-blur-sm">
      {/* Modal Box */}
      <div className="modal-box bg-gray/95 relative max-w-lg overflow-hidden rounded-2xl border border-white/10 p-0 shadow-2xl backdrop-blur-xl">
        {/* Top Decorative Line */}
        <div className="via-red absolute top-0 left-0 h-0.5 w-full bg-linear-to-r from-transparent to-transparent opacity-50" />

        <div className="flex flex-col gap-8 p-8">
          {/* Header */}
          <div className="text-center">
            <h3 className="heading-text text-white">New Target</h3>
            <p className="normal-text mt-2 text-white/50">
              Enter a domain to initiate a comprehensive scan.
            </p>
          </div>

          {/* Input Section */}
          <div className="flex flex-col gap-6">
            <div className="space-y-3">
              <label className="mid-text ml-1 block text-white/90">
                Target Domain
              </label>
              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <IoIosSearch className="text-yellowish-white h-5 w-5 opacity-50 transition-all duration-300 group-focus-within:opacity-100" />
                </div>
                <input
                  type="text"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit(e);
                    }
                  }}
                  placeholder="example.com"
                  className="mid-text focus:border-red/50 focus:ring-red/50 w-full rounded-xl border border-white/10 bg-black/40 py-4 pr-4 pl-12 text-white transition-all duration-300 placeholder:text-white/20 focus:bg-black/60 focus:shadow-[0_0_20px_rgba(206,50,50,0.1)] focus:ring-1 focus:outline-none"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4 transition-colors hover:bg-white/[0.07]">
              <div className="flex flex-col gap-1">
                <span className="mid-text text-white/90">Subdomain Scan</span>
                <span className="small-text text-white/40">
                  Include subdomains in scope?
                </span>
              </div>
              <BinaryToggle
                value={scanSubdomains}
                onChange={setScanSubdomains}
                leftOption="Skip"
                rightOption="Scan"
                width={140}
              />
            </div>
          </div>

          {/* Modal Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <button className="normal-text flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-white/60 transition-all duration-300 hover:border-white/20 hover:bg-white/5 hover:text-white active:scale-95">
              <img
                src={shareIcon}
                alt="Share Icon"
                className="h-4 w-4 opacity-70"
              />
              Share Target
            </button>
            <Link
              to={`/reconnaissance`}
              onClick={async () => {
                setDomain(domainInput);
                await insertNewTarget(domainInput).then(() =>
                  queryClient.refetchQueries({ queryKey: ["targets"] }),
                );
              }}
              className="bg-red shadow-red/20 hover:bg-light-red hover:shadow-red/40 mid-text flex cursor-pointer items-center justify-center gap-2 rounded-xl py-3 text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
            >
              <img src={searchIcon} alt="Search Icon" className="h-5 w-5" />
              Start Scan
            </Link>
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
  );
}
