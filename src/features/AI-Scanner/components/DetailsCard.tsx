import ReqResContent from "@/features/reqResPanel/components/ReqResContent";

export default function DetailsCard() {
  return (
    <div className="bg-gray rounded-6px flex flex-col gap-3 p-3">
      <div className="flex w-full items-center gap-3">
        <div className="rounded-6px w-full bg-black px-3">
          <ReqResContent requestAndResponse={false} type="Request" />
        </div>
        <div className="rounded-6px w-full bg-black px-3">
          <ReqResContent requestAndResponse={false} type="Response" />
        </div>
      </div>
      <div className="rounded-6px flex w-full flex-col gap-1 bg-black p-3">
        <p className="text-yellowish-white mid-text">Explanation</p>
        <p className="text-dark-yellowish-white small-text">
          Generate comprehensive security assessment reports
        </p>
      </div>
    </div>
  );
}
