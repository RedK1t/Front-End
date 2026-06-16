import { useLocation } from "react-router-dom";
import SideBar from "./sideBar/SideBar";
import ChatBot from "@/features/ChatBot/ChatBot";
import AnimatedOutlet from "@/components/AnimatedOutlet";

export default function AppLayout() {
  const { pathname } = useLocation();
  // Treat the whole Proxy section as one "page" so navigating between its
  // sub-routes doesn't remount the stateful ProxyLayout (socket/session).
  // Proxy sub-page transitions are animated inside ProxyLayout instead.
  const segment = pathname.split("/")[1]?.toLowerCase() || "home";
  const transitionKey = segment === "proxy" ? "proxy" : pathname;

  return (
    <>
      <SideBar />
      <ChatBot />
      <AnimatedOutlet transitionKey={transitionKey} />
    </>
  );
}
