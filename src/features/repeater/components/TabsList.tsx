import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useRef } from "react";
import Tab from "./Tab";

export default function TabsList() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };
  return (
    <div className="flex h-full w-full items-center gap-1 overflow-hidden">
      <button
        className="bg-gray rounded-6px hover:bg-gray/80 flex cursor-pointer items-center justify-center py-1.5 transition-colors"
        onClick={scrollLeft}
      >
        <IoIosArrowBack className="h-6 w-6" />
      </button>

      <div
        ref={scrollContainerRef}
        className="hide-scrollbar flex h-full w-full flex-1 items-center gap-1 overflow-auto"
      >
        <Tab text="GET /users" />
        <Tab text="POST /users" />
        <Tab text="PUT /users/:id" />
        <Tab text="DELETE /users/:id" />
        <Tab text="GET /products" />
        <Tab text="POST /auth/login" />
        <Tab text="GET /orders" />
        <Tab text="PATCH /orders/:id" />
        <Tab text="GET /inventory" />
        <Tab text="POST /checkout" />
        <Tab text="GET /analytics" />
        <Tab text="POST /webhooks" />
        <Tab text="GET /search" />
        <Tab text="PUT /settings" />
        <Tab text="GET /health" />
        <Tab text="POST /upload" />
        <Tab text="DELETE /media/:id" />
        <Tab text="GET /reports" />
        <Tab text="POST /graphql" />
      </div>
      <button
        className="bg-gray rounded-6px hover:bg-gray/80 flex cursor-pointer items-center justify-center py-1.5 transition-colors"
        onClick={scrollRight}
      >
        <IoIosArrowForward className="h-6 w-6" />
      </button>
    </div>
  );
}
