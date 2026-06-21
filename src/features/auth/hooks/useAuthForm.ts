import { signIn, signUp } from "@/api/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export interface AuthFormData {
  email: string;
  password: string;
  fullName: string;
  confirmPassword: string;
}

export interface AuthErrors {
  email?: string;
  password?: string;
  fullName?: string;
  confirmPassword?: string;
}

export const useAuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<AuthErrors>({});
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const validateEmail = (email: string): string | undefined => {
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email";
    }
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return undefined;
  };

  const validateSignupPassword = (password: string): string | undefined => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "Password must contain uppercase, lowercase, and number";
    }
    return undefined;
  };

  const validateFullName = (fullName: string): string | undefined => {
    if (!fullName) return "Full name is required";
    if (fullName.length < 2) return "Name must be at least 2 characters";
    return undefined;
  };

  const validateConfirmPassword = (
    password: string,
    confirmPassword: string,
  ): string | undefined => {
    if (!confirmPassword) return "Please confirm your password";
    if (password !== confirmPassword) return "Passwords do not match";
    return undefined;
  };

  const validateLoginForm = (formData: {
    email: string;
    password: string;
  }): boolean => {
    const newErrors: AuthErrors = {};

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSignupForm = (formData: Required<AuthFormData>): boolean => {
    const newErrors: AuthErrors = {};

    const fullNameError = validateFullName(formData.fullName || "");
    if (fullNameError) newErrors.fullName = fullNameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const passwordError = validateSignupPassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword || "",
    );
    if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: keyof AuthErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  async function handleSignup(e: React.FormEvent, formData: AuthFormData) {
    e.preventDefault();
    setIsLoading(true);
    if (
      !validateSignupForm({
        ...formData,
      })
    ) {
      setIsLoading(false);
      return;
    }

    await toast.promise(
      (async () => {
        await signUp(formData.email, formData.password, formData.fullName);
        // Wipe ANY cached queries from a previous user before entering the app
        queryClient.clear();
        navigate("/");
      })(),
      {
        loading: "Creating your account...",
        success: "Account created successfully! Welcome to RedKit!",
        error: (err) =>
          err instanceof Error ? err.message : "Failed to create account",
      },
    );

    setIsLoading(false);
  }

  async function handleLogin(
    e: React.FormEvent,
    formData: { email: string; password: string },
  ) {
    e.preventDefault();
    setIsLoading(true);
    if (
      !validateLoginForm({
        ...formData,
      })
    ) {
      setIsLoading(false);
      return;
    }

    await toast.promise(
      (async () => {
        await signIn(formData.email, formData.password);
        // Wipe ANY cached queries from a previous user before entering the app
        queryClient.clear();
        navigate("/");
      })(),
      {
        loading: "Signing you in...",
        success: "Welcome back to RedKit!",
        error: (err) =>
          err instanceof Error ? err.message : "Failed to sign in",
      },
    );

    setIsLoading(false);
  }

  return {
    isLoading,
    errors,
    validateLoginForm,
    validateSignupForm,
    clearError,
    handleSignup,
    handleLogin,
    setErrors,
  };
};
