import { useNavigate } from "react-router-dom";
import useIsLogin from "@/hooks/useIsLogin";
import { motion } from "motion/react";
import plusIcon from "../../../assets/PlusIcon.svg";
import NewTargetModal from "./NewTargetModal";

export default function NewTargetCard() {
  const isLogin = useIsLogin();

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
        onClick={() => (isLogin ? openModal() : navigate("/login"))}
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
      <NewTargetModal />
    </motion.div>
  );
}
