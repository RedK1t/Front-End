import { motion } from "motion/react";
import { useState } from "react";
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser } from "react-icons/fi";
import { Link } from "react-router-dom";
import AuthButton from "./components/AuthButton";
import AuthInput from "./components/AuthInput";
import PasswordStrengthIndicator from "./components/PasswordStrengthIndicator";
import { useAuthForm } from "./hooks/useAuthForm";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { isLoading, errors, handleSignup, clearError } = useAuthForm();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearError(field as keyof typeof errors);
  };

  return (
    <div className="via-gray flex min-h-screen items-center justify-center bg-linear-to-br from-black to-black p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Animated Background Elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="bg-dark-red/10 absolute top-20 left-20 h-64 w-64 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1.1, 1, 1.1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            className="bg-red/10 absolute right-20 bottom-20 h-72 w-72 rounded-full blur-3xl"
          />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10 mb-8 text-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} className="mb-4">
            <h1 className="heading-text">
              <span className="text-dark-red">Red</span>Kit
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="large-text text-yellowish-white"
          >
            Create your account to get started
          </motion.p>
        </motion.div>

        {/* Signup Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gray/90 border-red-transparent relative z-10 rounded-2xl border p-8 shadow-2xl backdrop-blur-sm"
        >
          <form
            onSubmit={(e) => handleSignup(e, formData)}
            className="space-y-6"
          >
            {/* Full Name Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <AuthInput
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(value) => handleInputChange("fullName", value)}
                error={errors.fullName}
                icon={<FiUser className="text-yellowish-white" />}
                label="Full Name"
              />
            </motion.div>

            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <AuthInput
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(value) => handleInputChange("email", value)}
                error={errors.email}
                icon={<FiMail className="text-yellowish-white" />}
                label="Email Address"
              />
            </motion.div>

            {/* Password Input with Strength Indicator */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            >
              <AuthInput
                className="pb-2"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(value) => handleInputChange("password", value)}
                error={errors.password}
                icon={<FiLock className="text-yellowish-white" />}
                label="Password"
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-yellowish-white rounded p-1 transition-colors hover:text-white"
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                }
              />
              <PasswordStrengthIndicator password={formData.password} />
            </motion.div>

            {/* Confirm Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <AuthInput
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(value) =>
                  handleInputChange("confirmPassword", value)
                }
                error={errors.confirmPassword}
                icon={<FiLock className="text-yellowish-white" />}
                label="Confirm Password"
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-yellowish-white rounded p-1 transition-colors hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                }
              />
            </motion.div>

            {/* Signup Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.0 }}
            >
              <AuthButton
                type="submit"
                isLoading={isLoading}
                loadingText="Creating account..."
              >
                Create Account
              </AuthButton>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.1 }}
            className="relative my-6"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="border-red-transparent w-full border-t"></div>
            </div>
          </motion.div>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.3 }}
            className="text-center"
          >
            <p className="small-text text-yellowish-white">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-light-red hover:text-red font-semibold transition-colors hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
