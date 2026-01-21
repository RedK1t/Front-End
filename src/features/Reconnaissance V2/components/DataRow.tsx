type DataRowProps = {
  label: string;
  value: string | string[];
};
export default function DataRow({ label, value }: DataRowProps) {
  if (Array.isArray(value) && value.length > 1)
    return (
      <div className="rounded-6px flex flex-col gap-y-1 bg-black/40 px-2 py-3">
        <p className="normal-text text-light-red">{label}</p>
        <div className="flex flex-col gap-y-1.5">
          {value.map((item, index) => (
            <>
              <p
                key={index}
                className="normal-text text-dark-yellowish-white pl-3 text-wrap break-all"
              >
                {item}
              </p>
            </>
          ))}
        </div>
      </div>
    );
  if (Array.isArray(value) && value.length === 1)
    return (
      <div className="rounded-6px flex items-center justify-between bg-black/40 px-2 py-3">
        <p className="normal-text text-light-red">{label}</p>
        <p className="normal-text text-dark-yellowish-white pl-3 text-end text-wrap">
          {value[0]}
        </p>
      </div>
    );
  if (typeof value === "string")
    return (
      <div className="rounded-6px flex items-center justify-between gap-2 bg-black/40 px-2 py-3">
        <p className="normal-text text-light-red">{label}</p>
        <p className="normal-text text-dark-yellowish-white text-end text-wrap break-all">
          {value}
        </p>
      </div>
    );
}
