import CodeWrapper from "@/components/CodeWrapper";

const defaultText = `GET /api/users/122 HTTP/I.I
Host: example.com
Content-Type: application/json
Authorization: Bearer ey...

{
    "name": "Jane Doe",
    "email": "jane.doe@example.com",
    "role": "user"
}`;

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
        <CodeWrapper language="json" initialValue={text} />
      </div>
    </div>
  );
}
