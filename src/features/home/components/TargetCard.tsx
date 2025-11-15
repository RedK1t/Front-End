import uparrowIcon from "../../../assets/uparrowIcon.svg";
import plusIcon from "../../../assets/PlusIcon.svg";
import shareIcon from "../../../assets/ShareIcon.svg";
import searchIcon from "../../../assets/SearchIcon.svg";

const LOGO_DEV_PUBLIC_KEY = "pk_e6MtMO_tQm6SnFDQtPovWg";

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
function CompanyLogo({ domain }: { domain: string }) {
  return (
    <img
      src={`https://img.logo.dev/${domain}?token=${LOGO_DEV_PUBLIC_KEY}&format=png&retina=true&theme=dark`}
      alt="Company logo"
      className="h-12 w-12 rounded-full"
    />
  );
}
export default function TargetCard(props: TargetCardProps) {
  function openModal() {
    const modal = document.getElementById(
      "addTargetModal",
    ) as HTMLDialogElement | null;
    modal?.showModal();
  }
  const { isNew } = props;
  if (isNew) {
    return (
      <>
        <button
          onClick={openModal}
          className="bg-gray/80 flex h-52 w-72 cursor-pointer flex-col items-center justify-center rounded-[14px] px-3 pt-1.5 pb-4 transition-all duration-300 hover:translate-y-[-4px]"
        >
          <img src={plusIcon} alt="Plus Icon" className="h-15 w-15" />
          <p className="heading-text">Add Target</p>
          {/* Open the modal using document.getElementById('ID').showModal() method */}
        </button>

        {/* Modal */}
        <dialog id="addTargetModal" className="modal backdrop-blur-xs">
          {/* Modal Box */}
          <div className="modal-box bg-gray/80 border-yellowish-white/50 flex flex-col gap-14 rounded-2xl border-[0.5px] px-10 py-5 shadow-lg backdrop-blur-md">
            {/* Modal Input */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-start gap-2">
                <p className="heading-text text-light-red">Target Name</p>
                <input
                  type="text"
                  placeholder="Tesla"
                  className="placeholder:large-text placeholder:text-dark-yellowish-white w-full rounded-md bg-black p-3 outline-0"
                />
              </div>

              <div className="flex flex-col items-start gap-2">
                <p className="heading-text text-light-red">Main Domain</p>
                <input
                  type="text"
                  placeholder="tesla.com"
                  className="placeholder:large- placeholder:text-dark-yellowish-white w-full rounded-md bg-black p-3 outline-0"
                />
              </div>
            </div>

            {/* Modal Buttons */}
            <div className="flex items-center justify-between">
              <button className="border-dark-red shadow-dark-red/20 bg-gray large-text flex cursor-pointer items-center gap-2 rounded-lg border px-8 py-1 shadow-[0_0_15px]">
                <img src={shareIcon} alt="Share Icon" className="h-6 w-6" />
                Share
              </button>
              <button className="border-dark-red shadow-dark-red/20 bg-dark-red large-text flex cursor-pointer items-center gap-2 rounded-lg border px-8 py-1 shadow-[0_0_15px]">
                <img src={searchIcon} alt="Search Icon" className="h-6 w-6" />
                Test Now
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </>
    );
  }

  if (!isNew) {
    const { targetName, targetDomain, vulnerabilitiesFound, lastScanned } =
      props;
    return (
      <div className="bg-gray/80 flex h-52 w-72 flex-col justify-between rounded-[14px] p-4 transition-all duration-300 hover:-translate-y-[4px]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <p className="heading-text text-white">{targetName}</p>
            <p className="normal-text text-yellowish-white">{targetDomain}</p>
          </div>
          <CompanyLogo domain={targetDomain} />
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
            <button className="small-text shadow-red/20 hover:shadow-red/50 border-button-glow cursor-pointer rounded-md border bg-black px-2 py-1 text-white shadow-[0_0_15px]">
              manage
            </button>
          </div>
        </div>
      </div>
    );
  }
}
