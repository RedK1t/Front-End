type InfoRowProps = {
  label: string;
  value: string;
};
export default function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex justify-between gap-3 rounded-md bg-black p-3 text-wrap">
      <p className="normal-text">{label}</p>
      <p className="normal-text text-red">{value}</p>
    </div>
  );
}
