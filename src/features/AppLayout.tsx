import { Outlet } from "react-router-dom";
import SideBar from "./sideBar/SideBar";
import Home from "./home/Home";
import { useDomain } from "@/context/DomainContext";
import ChatBot from "@/features/ChatBot/ChatBot";

export default function AppLayout() {
  const { domain } = useDomain();

  if (!domain) {
    return (
      <>
        <ChatBot />
        <Home />
      </>
    );
  }
  return (
    <>
      <SideBar />
      <ChatBot />
      <Outlet />
    </>
  );
}
