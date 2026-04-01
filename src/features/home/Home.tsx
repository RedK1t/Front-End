import { useDomain } from "@/context/DomainContext";
import Navbar from "./components/Navbar";
import TargetCardList from "./components/TargetCardList";
import { useEffect } from "react";

export default function Home() {
  const { setDomain, setSelectedSubdomain } = useDomain();
  useEffect(() => {
    setDomain("");
    setSelectedSubdomain("");
  }, [setDomain, setSelectedSubdomain]);
  return (
    <div>
      <Navbar />
      <TargetCardList />
    </div>
  );
}
