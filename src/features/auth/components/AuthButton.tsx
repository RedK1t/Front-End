import { motion } from "motion/react";
import { type ReactNode } from "react";
import Loader from "@/components/Loader";

type AuthButtonProps = {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
  loadingText?: string;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
};

export default function AuthButton({
  children,
  type = "button",
  isLoading = false,
  loadingText = "Loading...",
  onClick,
  className = "",
  variant = "primary",
}: AuthButtonProps) {
  const baseStyles =
    "w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-dark-red to-red text-white hover:from-red hover:to-light-red focus:ring-dark-red shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    secondary:
      "bg-black text-white border border-red-transparent hover:border-light-red focus:ring-dark-red",
    outline:
      "bg-transparent text-light-red border border-light-red hover:bg-light-red hover:text-white focus:ring-light-red",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variantStyles[variant]} ${className} ${
        isLoading ? "cursor-not-allowed opacity-75" : ""
      }`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <Loader scale={0.4} color="#ffffff" />
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
}
