import openIcon from "@/assets/openIcon.svg";
type CrtRowProps = {
  issuerCaId: number;
  issuer_name: string;
};

export default function CrtRow({ issuerCaId, issuer_name }: CrtRowProps) {
  return (
    <div className="flex w-full justify-between gap-3 rounded-md bg-black p-3 text-wrap">
      <p className="normal-text text-yellowish-white">{issuer_name}</p>
      <div className="flex items-center gap-2">
        <p className="normal-text text-red text-end whitespace-pre-wrap">
          {issuerCaId}
        </p>
        <a
          href={`https://crt.sh/?caid=${issuerCaId}`}
          className="h-5 w-5"
          target="_blank"
        >
          <img src={openIcon} alt="" className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}
