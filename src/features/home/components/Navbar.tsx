import { signOut } from "@/api/supabase";
import useGetUserLocally from "@/hooks/useGetUserLocally";
import { useQueryClient } from "@tanstack/react-query";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import searchIcon from "../../../assets/SearchIcon.svg";
import { useState } from "react";

export default function Navbar() {
  const user = useGetUserLocally();
  const [userName, setUserName] = useState(user?.user.user_metadata.name || "");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await signOut();
    } finally {
      setUserName("");
      // Drop all cached data, then leave the dashboard so the projects unmount
      // cleanly (instead of refetching into the same view).
      queryClient.clear();
      navigate("/login");
    }
  }
  return (
    <div className="bg-gray mx-auto mt-6 flex w-11/12 items-center justify-between rounded-2xl px-3 py-2">
      <div className="flex cursor-pointer items-center gap-1">
        <Logo variant="wordmark" className="h-9 w-auto" />
      </div>

      <div className="hidden items-center gap-2 rounded-xl bg-black px-1 py-1.5 md:flex md:w-5/12 lg:w-4/12">
        <img src={searchIcon} alt="Search Icon" />
        <input
          type="text"
          className="placeholder:small-text w-full placeholder:text-white/20 focus:outline-0"
          placeholder=" Search for a previous target"
        ></input>
      </div>

      <div className="flex w-64 items-center justify-end gap-3">
        {userName ? (
          <div className="flex w-full items-center justify-between">
            <span className="mid-text text-white">
              Welcome, {userName.split(" ")[0]}
            </span>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-dark-red hover:bg-red group flex items-center gap-2 rounded-xl px-4 py-2 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 enabled:cursor-pointer"
            >
              <FiLogOut className="transition-transform duration-200" />
              <span className="small-text font-semibold">
                {isLoggingOut ? "Logging out…" : "Logout"}
              </span>
            </button>
          </div>
        ) : (
          <Link
            className="bg-dark-red hover:bg-red group flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
            to="/login"
          >
            <FiLogIn className="transition-transform duration-200" />
            <span className="small-text font-semibold">Login</span>
          </Link>
        )}
      </div>
    </div>
  );
}
