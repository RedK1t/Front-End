import redKitLogo from "../../../assets/redKitLogo.svg";
import searchIcon from "../../../assets/SearchIcon.svg";
import { signOut } from "@/api/supabase";
import { FiLogIn, FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import useGetUser from "../hooks/useGetUser";

export default function Navbar() {
  const { data: user } = useGetUser();
  const userName = user?.user_metadata?.name || "";
  const queryClient = useQueryClient();
  return (
    <div className="bg-gray mx-auto mt-6 flex w-11/12 items-center justify-between rounded-2xl px-3 py-2">
      <div className="flex cursor-pointer items-center gap-1">
        <img src={redKitLogo} alt="RedKit Logo" />
        <h1 className="large-text text-white">
          <span className="text-dark-red">Red</span>
          Kit
        </h1>
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
              onClick={async () => {
                await signOut();
                // Revalidate the targets query after sign-out
                queryClient.refetchQueries({ queryKey: ["targets"] });
                // Also invalidate other user-related queries
                queryClient.refetchQueries({ queryKey: ["user"] });
              }}
              className="bg-dark-red hover:bg-red group flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-white transition-all duration-200 hover:scale-105 hover:shadow-lg"
            >
              <FiLogOut className="transition-transform duration-200" />
              <span className="small-text font-semibold">Logout</span>
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
