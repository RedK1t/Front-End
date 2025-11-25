import CodeWrapper from "@/components/CodeWrapper";

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
};

export default function ReqResContent({
  text = defaultText,
  type,
}: ReqResContentProps) {
  return (
    <div
      className={`${type === "Request" ? "border-light-red border-r pr-5" : "pl-5"} flex h-full w-1/2 flex-col gap-2.5 py-5`}
    >
      <p className="normal-text text-white">{type}</p>
      <div className="bg-gray text-yellowish-white coding-text h-full min-h-[100px] w-full overflow-y-hidden rounded-[5px] p-2.5">
        <CodeWrapper language="http" initialValue={text} />
      </div>
    </div>
  );
}
