import { Outlet } from "react-router-dom";
import SideBar from "./sideBar/SideBar";
import ChatBot from "@/features/ChatBot/ChatBot";

export default function AppLayout() {
  return (
    <>
      <SideBar />
      <ChatBot />
      <Outlet />
    </>
  );
}
