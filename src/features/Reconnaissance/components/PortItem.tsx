type PortItemProps = {
  port: number;
  protocol: string;
  state: string;
  service: string;
  serviceVersion: string;
};
export default function PortItem({
  port,
  protocol,
  state,
  service,
  serviceVersion,
}: PortItemProps) {
  return (
    <div className="normal-text bg-gray text-yellowish-white flex w-full items-center justify-between rounded-md px-8 py-3 text-wrap">
      <p className="w-10 text-left">{port}</p>
      <p className="text-red w-2 text-center">|</p>
      <p className="w-20 text-center">{service}</p>
      <p className="text-red w-2 text-center">|</p>
      <p className="w-12 text-center">{state}</p>
      <p className="text-red w-2 text-center">|</p>
      <p className="w-20 text-center">{protocol}</p>
      <p className="text-red w-2 text-center">|</p>
      <p className="w-36 text-center">{serviceVersion}</p>
    </div>
  );
}
