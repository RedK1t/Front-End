import fawryLogo from "../../../assets/fawry.png";
import uparrowIcon from "../../../assets/uparrowIcon.svg";
import plusIcon from "../../../assets/plusIcon.svg";

type RecentTargetCardProps = {
  isNew?: false;
  targetName: string;
  targetDomain: string;
  vulnerabilitiesFound: number;
  lastScanned: string;
};

type NewTargetCardProps = {
  isNew: true;
};

type TargetCardProps = RecentTargetCardProps | NewTargetCardProps;
export default function TargetCard(props: TargetCardProps) {
  const { isNew } = props;
  if (isNew) {
    return (
      <div className="bg-gray/50 border-dark-yellowish-white flex h-52 w-72 cursor-pointer flex-col items-center justify-center rounded-[14px] border px-3 pt-1.5 pb-4 transition-all duration-300 hover:translate-y-[-4px]">
        <img src={plusIcon} alt="Plus Icon" className="h-15 w-15" />
        <p className="heading-text">Add Target</p>
      </div>
    );
  }

  if (!isNew) {
    const { targetName, targetDomain, vulnerabilitiesFound, lastScanned } =
      props;
    return (
      <div className="bg-gray/50 border-dark-yellowish-white flex h-52 w-72 flex-col justify-between rounded-[14px] border px-3 pt-1.5 pb-4 transition-all duration-300 hover:translate-y-[-4px]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="heading-text text-white">{targetName}</p>
            <p className="normal-text text-yellowish-white">{targetDomain}</p>
          </div>
          <img src={fawryLogo} alt="Fawry Logo" className="h-12 w-12" />
        </div>

        <div className="flex justify-between">
          <div className="flex w-1/2 flex-col gap-2">
            <p className="normal-text text-white">Vulnerabilities Found</p>
            <div className="flex items-end">
              <p className="heading-text text-red text-shadow-red text-shadow-[0_0_24px_rgba(255,0,0,1)]">
                {vulnerabilitiesFound}
              </p>
              <img
                src={uparrowIcon}
                alt="Up Arrow Icon"
                className="h-5 w-5 -translate-y-1/4"
              />
            </div>
          </div>

          <div className="flex flex-col items-end justify-between">
            <div className="flex flex-col gap-1 text-end">
              <p className="normal-text">Last Scanned</p>
              <p className="normal-text text-red">{lastScanned}</p>
            </div>
            <button className="small-text shadow-button-glow border-button-glow cursor-pointer rounded-md border bg-black px-2 py-1 text-white shadow-[0_0_15px]">
              manage
            </button>
          </div>
        </div>
      </div>
    );
  }
}
