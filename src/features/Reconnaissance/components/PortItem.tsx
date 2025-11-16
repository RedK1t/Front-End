type PortItemProps = {
  port: string;
  protocol: string;
};
export default function PortItem({ port, protocol }: PortItemProps) {
  return (
    <div className="normal-text bg-gray flex w-40 items-center justify-center gap-6 rounded-md px-8 py-3 text-white shadow-[inset_0_0_30px] shadow-black/25">
      <p>{port}</p>
      <p>{protocol}</p>
    </div>
  );
}
