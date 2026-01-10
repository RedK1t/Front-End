import { useDomain } from "@/context/DomainContext";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import plusIcon from "../../../assets/PlusIcon.svg";
import shareIcon from "../../../assets/ShareIcon.svg";
import searchIcon from "../../../assets/SearchIcon.svg";
import { motion } from "motion/react";

export default function NewTargetCard() {
  const [domainInput, setDomainInput] = useState("");
  const { setDomain } = useDomain();
  const navigate = useNavigate();
  function openModal() {
    const modal = document.getElementById(
      "addTargetModal",
    ) as HTMLDialogElement | null;
    modal?.showModal();
  }
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
      <button
        onClick={openModal}
        className="bg-gray/80 flex h-52 w-72 cursor-pointer flex-col items-center justify-center rounded-[14px] px-3 pt-1.5 pb-4 transition-all duration-300 hover:-translate-y-1"
      >
        <img src={plusIcon} alt="Plus Icon" className="h-15 w-15" />
        <p className="heading-text">Add Target</p>
        {/* Open the modal using document.getElementById('ID').showModal() method */}
      </button>

      {/* Modal */}
      <dialog id="addTargetModal" className="modal backdrop-blur-xs">
        {/* Modal Box */}
        <div className="modal-box bg-gray/80 border-yellowish-white/50 flex flex-col gap-14 rounded-2xl border-[0.5px] px-10 py-5 shadow-lg backdrop-blur-md">
          {/* Modal Input */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-start gap-2">
              <p className="heading-text text-light-red">Target Name</p>
              <input
                type="text"
                placeholder="Tesla"
                className="placeholder:large-text placeholder:text-dark-yellowish-white w-full rounded-md bg-black p-3 outline-0"
              />
            </div>

            <div className="flex flex-col items-start gap-2">
              <p className="heading-text text-light-red">Main Domain</p>
              <input
                type="text"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setDomain(domainInput);
                    navigate(`/reconnaissance`);
                  }
                }}
                placeholder="tesla.com"
                className="placeholder:large-text placeholder:text-dark-yellowish-white w-full rounded-md bg-black p-3 outline-0"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
              />
            </div>
          </div>

          {/* Modal Buttons */}
          <div className="flex items-center justify-between">
            <button className="border-dark-red shadow-dark-red/20 bg-gray normal-text flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 shadow-[0_0_15px]">
              <img src={shareIcon} alt="Share Icon" className="h-5 w-5" />
              Share
            </button>
            <Link
              to={`/reconnaissance`}
              onClick={() => setDomain(domainInput)}
              className="border-dark-red shadow-dark-red/20 bg-dark-red normal-text flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 shadow-[0_0_15px]"
            >
              <img src={searchIcon} alt="Search Icon" className="h-5 w-5" />
              Test Now
            </Link>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </motion.div>
  );
}
