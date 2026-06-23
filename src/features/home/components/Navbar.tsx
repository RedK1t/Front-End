import { signOut } from "@/api/supabase";
import useGetUserLocally from "@/hooks/useGetUserLocally";
import { useQueryClient } from "@tanstack/react-query";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Logo from "@/components/Logo";
import { useEffect, useState } from "react";

export default function Navbar() {
  const user = useGetUserLocally();
  const [userName, setUserName] = useState(user?.user.user_metadata.name || "");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  useEffect(() => {
    setUserName(user?.user.user_metadata.name || "");
  }, [user]);

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
      <div className="flex w-full cursor-pointer items-center gap-1">
        <Logo variant="wordmark" className="h-9 w-auto" />
      </div>

      <div className="hidden w-full items-center gap-2 rounded-xl bg-black px-1 py-1.5 md:flex">
        <IoIosSearch className="text-yellowish-white ml-1 h-5 w-5 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            const newSearchParams = new URLSearchParams(searchParams);
            const value = e.target.value.trim();

            if (value) {
              newSearchParams.set("search", value);
            } else {
              newSearchParams.delete("search");
            }

            setSearchParams(newSearchParams, { replace: true });
          }}
          className="placeholder:small-text w-full placeholder:text-white/20 focus:outline-0"
          placeholder="Search for a previous target"
        />
      </div>

      <div className="flex w-full items-center gap-3">
        {userName ? (
          <div className="flex w-full items-center justify-end gap-3">
            <span className="mid-text text-white">
              Welcome, {userName.split(" ")[0]}
            </span>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-dark-red hover:bg-red group flex items-center gap-2 rounded-xl px-4 py-2 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
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
