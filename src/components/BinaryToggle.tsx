import { motion } from "motion/react";

interface BinaryToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  leftOption?: string;
  rightOption?: string;
  width?: number;
}

export default function BinaryToggle({
  value,
  onChange,
  leftOption = "No",
  rightOption = "Yes",
  width = 64,
}: BinaryToggleProps) {
  return (
    <div className="flex flex-col gap-3">
      <div
        style={{ width: `${width}px` }}
        className="relative flex h-11 items-center rounded-xl border border-white/10 bg-black/50 p-1"
      >
        {/* Animated Background Slider */}
        <motion.div
          style={{ width: `${width / 2}px` }}
          className="bg-red absolute h-9 rounded-lg shadow-[0_0_15px_rgba(206,50,50,0.4)]"
          initial={false}
          animate={{
            x: value ? `${width / 2 - 9}px` : "0px",
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        />

        {/* Options */}
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`normal-text relative z-10 h-full flex-1 cursor-pointer transition-colors duration-200 ${
            !value ? "text-white" : "text-dark-yellowish-white hover:text-white"
          }`}
        >
          {leftOption}
        </button>
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`normal-text relative z-10 h-full flex-1 cursor-pointer transition-colors duration-200 ${
            value ? "text-white" : "text-dark-yellowish-white hover:text-white"
          }`}
        >
          {rightOption}
        </button>
      </div>
    </div>
  );
}
