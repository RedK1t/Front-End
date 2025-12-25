import { Outlet } from "react-router-dom";
import SideBar from "./sideBar/SideBar";
import Home from "./home/Home";
import { useDomain } from "@/context/DomainContext";

export default function AppLayout() {
  const { domain } = useDomain();

  if (!domain) {
    return <Home />;
  }
  return (
    <>
      <SideBar />
      <Outlet />
    </>
  );
}
