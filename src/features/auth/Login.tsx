import { motion } from "motion/react";
import { useState } from "react";
import { FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";
import AuthButton from "./components/AuthButton";
import AuthInput from "./components/AuthInput";
import { useAuthForm } from "./hooks/useAuthForm";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, errors, clearError, handleLogin } = useAuthForm();

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
            Welcome back to your cybersecurity toolkit
          </motion.p>
          <p className="normal-text text-dark-yellowish-white mt-2">
            Sign in to access your security tools
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gray/90 border-red-transparent relative z-10 rounded-2xl border p-8 shadow-2xl backdrop-blur-sm"
        >
          <form
            onSubmit={(e) => {
              handleLogin(e, formData);
            }}
            className="space-y-6"
          >
            {/* Email Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
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

            {/* Password Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <AuthInput
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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
            </motion.div>

            {/* Login Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <AuthButton
                type="submit"
                isLoading={isLoading}
                loadingText="Signing in..."
              >
                Sign In
              </AuthButton>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.9 }}
            className="relative my-6"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="border-red-transparent w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray/90 normal-text text-yellowish-white px-3">
                Or continue with
              </span>
            </div>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.1 }}
            className="text-center"
          >
            <p className="small-text text-yellowish-white">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-light-red hover:text-red font-semibold transition-colors hover:underline"
              >
                Sign up here
              </Link>
            </p>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="relative z-10 mt-8 text-center"
        >
          <p className="small-text text-dark-yellowish-white">
            By signing in, you agree to our{" "}
            <Link
              to="/terms"
              className="text-yellowish-white transition-colors hover:text-white hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="text-yellowish-white transition-colors hover:text-white hover:underline"
            >
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
