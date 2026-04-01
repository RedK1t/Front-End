import { motion } from "motion/react";
import { FiCheck, FiX } from "react-icons/fi";

interface PasswordStrength {
  strength: number;
  label: string;
  color: string;
}

interface PasswordRequirements {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

type PasswordStrengthIndicatorProps = {
  password: string;
  showRequirements?: boolean;
};

export default function PasswordStrengthIndicator({ 
  password, 
  showRequirements = true 
}: PasswordStrengthIndicatorProps) {
  const getPasswordStrength = (password: string): PasswordStrength => {
    if (password.length === 0) return { strength: 0, label: "", color: "bg-gray" };
    
    const requirements = checkPasswordRequirements(password);
    const metRequirements = Object.values(requirements).filter(Boolean).length;
    
    if (metRequirements <= 2) return { strength: 1, label: "Weak", color: "bg-red" };
    if (metRequirements <= 4) return { strength: 2, label: "Medium", color: "bg-yellow" };
    return { strength: 3, label: "Strong", color: "bg-green" };
  };

  const checkPasswordRequirements = (password: string): PasswordRequirements => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const passwordStrength = getPasswordStrength(password);
  const requirements = checkPasswordRequirements(password);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="small-text text-yellowish-white">Password strength</span>
        <span className={`small-text ${passwordStrength.color.replace('bg-', 'text-')}`}>
          {passwordStrength.label}
        </span>
      </div>
      
      <div className="w-full bg-black rounded-full h-1">
        <motion.div
          className={`h-1 rounded-full transition-all duration-300 ${passwordStrength.color}`}
          initial={{ width: 0 }}
          animate={{ width: `${(passwordStrength.strength / 3) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {showRequirements && password.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-1 pt-2"
        >
          <div className="flex items-center space-x-2">
            {requirements.minLength ? (
              <FiCheck className="text-green text-xs" />
            ) : (
              <FiX className="text-red text-xs" />
            )}
            <span className={`coding-text ${requirements.minLength ? 'text-green' : 'text-red'}`}>
              At least 8 characters
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {requirements.hasUppercase ? (
              <FiCheck className="text-green text-xs" />
            ) : (
              <FiX className="text-red text-xs" />
            )}
            <span className={`coding-text ${requirements.hasUppercase ? 'text-green' : 'text-red'}`}>
              One uppercase letter
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {requirements.hasLowercase ? (
              <FiCheck className="text-green text-xs" />
            ) : (
              <FiX className="text-red text-xs" />
            )}
            <span className={`coding-text ${requirements.hasLowercase ? 'text-green' : 'text-red'}`}>
              One lowercase letter
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            {requirements.hasNumber ? (
              <FiCheck className="text-green text-xs" />
            ) : (
              <FiX className="text-red text-xs" />
            )}
            <span className={`coding-text ${requirements.hasNumber ? 'text-green' : 'text-red'}`}>
              One number
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}