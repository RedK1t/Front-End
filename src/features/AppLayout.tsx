import { Outlet } from "react-router-dom";
import SideBar from "./sideBar/SideBar";
export default function AppLayout() {
  return (
    <>
      <SideBar />
      <Outlet />
    </>
  );
}
