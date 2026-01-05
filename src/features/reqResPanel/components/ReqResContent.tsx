import CodeWrapper from "@/components/CodeWrapper";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { useSearchParams } from "react-router-dom";

const defaultText = `POST /api/v1/orders HTTP/1.1
Host: api.example.com
Content-Type: application/json
Accept: application/json
User-Agent: ExampleClient/5.4 (Linux; x86_64)
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....
X-Request-ID: 8c4d0d1f-3421-4cc2-b52c-cf55b48e4579
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Content-Length: 421

{
  "customer": {
    "id": "CUST-24015",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-390-5555",
    "address": {
      "line1": "155 Market Street",
      "line2": "Suite 800",
      "city": "San Francisco",
      "state": "CA",
      "postal": "94103",
      "country": "USA"
    }
  },
  "items": [
    {
      "sku": "BOOK-94822",
      "product_name": "Learning Distributed Systems",
      "quantity": 2,
      "unit_price": 39.95
    },
    {
      "sku": "USB-4411",
      "product_name": "USB-C Cable (2m)",
      "quantity": 1,
      "unit_price": 14.99
    }
  ],
  "payment": {
    "method": "credit_card",
    "card_last4": "1221",
    "transaction_id": "TX-89234-4412"
  },
  "shipping_method": "express",
  "notes": "Please include a gift receipt."
}
`;

type ReqResContentProps = {
  text?: string;
  type: "Request" | "Response";
  editableProp?: boolean;
};

export default function ReqResContent({
  text = defaultText,
  type,
  editableProp = true,
}: ReqResContentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // wait until the classes are loaded
    setTimeout(() => {
      if (ref.current) {
        // Search ONLY inside this div
        const elements = ref.current.querySelectorAll(".ͼ12");
        setCount(elements.length);
        elements[0]?.scrollIntoView({ behavior: "smooth" });
      }
    }, 200);
  }, [query]);

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    const newURL = new URLSearchParams(searchParams);
    if (e.target.value === "") {
      newURL.delete(`${type}query`);
    } else {
      newURL.set(`${type}query`, e.target.value);
    }
    setSearchParams(newURL, { replace: true });
  }

  function handleClear() {
    setQuery("");
    const newURL = new URLSearchParams(searchParams);
    newURL.delete(`${type}query`);
    setSearchParams(newURL, { replace: true });
  }

  function handlePrev() {
    if (index > 0) {
      setIndex(index - 1);
      const elements = ref.current?.querySelectorAll(".ͼ12");
      elements?.[index - 1]?.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleNext() {
    if (index < count - 1) {
      setIndex(index + 1);
      const elements = ref.current?.querySelectorAll(".ͼ12");
      elements?.[index + 1]?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div
      className={`${type === "Request" ? "border-light-red border-r pr-5" : "pl-5"} flex h-full w-1/2 flex-col gap-2.5 py-5`}
    >
      {/* header */}
      <p className="normal-text text-white">{type}</p>

      {/* code */}
      <div
        ref={ref}
        className="bg-gray text-yellowish-white coding-text h-full min-h-[100px] w-full overflow-y-hidden rounded-[5px] p-2.5"
      >
        <CodeWrapper
          language="http"
          initialValue={text}
          editableProp={editableProp}
          type={type}
        />
      </div>

      {/* footer */}
      <div className="flex items-center gap-2.5">
        <div className="bg-gray rounded-6px flex w-full items-center pr-2.5">
          <Input
            placeholder="Search"
            className="bg-gray rounded-6px h-9 border-0 focus-visible:border-0 focus-visible:ring-0"
            onChange={handleOnChange}
            value={query}
          />
          <MdCancel
            onClick={handleClear}
            className="text-yellowish-white h-5 w-5 cursor-pointer"
          />
        </div>
        <button
          onClick={handlePrev}
          className="rounded-6px bg-gray flex h-full w-12 cursor-pointer items-center justify-center"
        >
          <FaArrowLeft />
        </button>
        <button
          onClick={handleNext}
          className="rounded-6px bg-gray flex h-full w-12 cursor-pointer items-center justify-center"
        >
          <FaArrowRight />
        </button>
        <p className="normal-text ml-2.5 text-nowrap text-white">
          {count} matches found
        </p>
      </div>
    </div>
  );
}
