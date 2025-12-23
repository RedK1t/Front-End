import { Outlet } from "react-router-dom";
import SideBar from "./sideBar/SideBar";
import { SubdomainProvider } from "../context/SubdomainContext";

export default function AppLayout() {
  return (
    <>
      <SideBar />
      <Outlet />
    </>
  );
}
