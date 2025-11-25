import Header from "./components/Header";
import ReqResContent from "./components/ReqResContent";

const responseText = `HTTP/1.1 201 Created
Date: Wed, 26 Nov 2025 00:22:41 GMT
Content-Type: application/json
Content-Length: 512
X-Request-ID: 8c4d0d1f-3421-4cc2-b52c-cf55b48e4579
Server: ExampleAPI/1.0

{
  "status": "success",
  "order_id": "ORD-587421",
  "message": "Order created successfully.",
  "created_at": "2025-11-26T00:22:41Z",
  "customer": {
    "id": "CUST-24015",
    "name": "John Doe"
  },
  "items": [
    {
      "sku": "BOOK-94822",
      "quantity": 2,
      "unit_price": 39.95
    },
    {
      "sku": "USB-4411",
      "quantity": 1,
      "unit_price": 14.99
    }
  ],
  "totals": {
    "items_total": 94.89,
    "shipping_cost": 12.00,
    "tax": 7.11,
    "grand_total": 114.00
  },
  "payment_status": "authorized",
  "shipping": {
    "method": "express",
    "estimated_delivery": "2025-11-29"
  }
}
`;

export default function BottomPanel() {
  return (
    <div className="flex h-full flex-col">
      <Header />
      {/* Div for border */}
      <div className="border-light-red h-full w-full overflow-y-hidden border-t">
        {/* Div for content */}
        <div className="mx-auto flex h-full w-11/12 items-start justify-between">
          <ReqResContent type="Request" />
          <ReqResContent type="Response" text={responseText} />
        </div>
      </div>
    </div>
  );
}
