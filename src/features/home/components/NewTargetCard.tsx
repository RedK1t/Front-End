import { useDomain } from "@/context/DomainContext";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import plusIcon from "../../../assets/PlusIcon.svg";
import shareIcon from "../../../assets/ShareIcon.svg";
import searchIcon from "../../../assets/SearchIcon.svg";
import { motion } from "motion/react";
import { useSubdomainContext } from "@/context/SubdomainContext";
import BinaryToggle from "@/components/BinaryToggle";
import type { RecentScannedSubdomains } from "@/features/types";

export default function NewTargetCard() {
  const [domainInput, setDomainInput] = useState("");
  const { setDomain } = useDomain();
  const { scanSubdomains, setScanSubdomains } = useSubdomainContext();
  const raw = localStorage.getItem("scannedSubdomains");
  const scannedSubdomains: RecentScannedSubdomains = JSON.parse(raw || "[]");
  const navigate = useNavigate();
  function handleSubmit(e: React.KeyboardEvent<HTMLInputElement>) {
    e.preventDefault();
    setDomain(domainInput);
    if (scannedSubdomains.length > 0) {
      localStorage.setItem(
        "scannedSubdomains",
        JSON.stringify([
          ...scannedSubdomains,
          {
            targetDomain: domainInput,
            lastScanned: new Date(),
            vulnerabilitiesFound: 0,
          },
        ]),
      );
    } else {
      localStorage.setItem(
        "scannedSubdomains",
        JSON.stringify([
          {
            targetDomain: domainInput,
            lastScanned: new Date(),
            vulnerabilitiesFound: 0,
          },
        ]),
      );
    }
    navigate(`/reconnaissance`);
  }
  function openModal() {
    const modal = document.getElementById(
      "addTargetModal",
    ) as HTMLDialogElement | null;
    modal?.showModal();
  }
  return (
    <motion.div
      initial={{
        scale: 0.95,
        opacity: 0,
      }}
      whileInView={{
        scale: 1,
        opacity: 1,
        transition: {
          type: "spring",
          duration: 0.6,
          bounce: 0.3,
        },
      }}
      viewport={{ once: true }}
    >
      <button
        onClick={openModal}
        className="bg-gray/80 hover:border-red/30 group flex h-52 w-72 cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border border-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(206,50,50,0.15)]"
      >
        <div className="group-hover:bg-red/10 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 transition-colors duration-300">
          <img
            src={plusIcon}
            alt="Plus Icon"
            className="h-8 w-8 opacity-60 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100"
          />
        </div>
        <p className="heading-text text-white/80 transition-colors group-hover:text-white">
          Add Target
        </p>
      </button>

      {/* Modal */}
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
                    <img
                      src={searchIcon}
                      className="h-5 w-5 opacity-40 grayscale transition-all duration-300 group-focus-within:opacity-100 group-focus-within:grayscale-0"
                    />
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
                onClick={() => {
                  if (scannedSubdomains.length > 0) {
                    localStorage.setItem(
                      "scannedSubdomains",
                      JSON.stringify([
                        ...scannedSubdomains,
                        {
                          targetDomain: domainInput,
                          lastScanned: new Date(),
                          vulnerabilitiesFound: 0,
                        },
                      ]),
                    );
                  } else {
                    localStorage.setItem(
                      "scannedSubdomains",
                      JSON.stringify([
                        {
                          targetDomain: domainInput,
                          lastScanned: new Date(),
                          vulnerabilitiesFound: 0,
                        },
                      ]),
                    );
                  }
                  setDomain(domainInput);
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
    </motion.div>
  );
}
