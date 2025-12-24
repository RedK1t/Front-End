import getMethodColor from "@/utils/getMethodColor";
import { Handle, Position } from "@xyflow/react";
import { useSearchParams } from "react-router-dom";

type NodeProps = {
  id: string;
  data: {
    endpoint: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
  };
};

export function Node({ id, data }: NodeProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <div
      onClick={() => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("selected", id);
        setSearchParams(newSearchParams);
      }}
      className="bg-gray small-text flex min-w-[175px] items-center gap-2.5 rounded-[5px] p-3"
    >
      <p
        className={`${getMethodColor(data.method)} rounded-[3px] px-1 py-0.5 text-center`}
      >
        {data.method}
      </p>
      <p>{data.endpoint}</p>
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
}
