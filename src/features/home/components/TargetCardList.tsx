import TargetCard from "./TargetCard";
import useGetTargets from "../hooks/useGetTargets";
import Loader from "@/components/Loader";

export default function TargetCardList() {
  const { data: targets, isLoading } = useGetTargets();
  return (
    <div className="mx-auto mt-14 flex min-h-full w-full flex-wrap items-center justify-center gap-4 pb-14 md:w-11/12 lg:justify-start xl:w-10/12">
      {isLoading ? (
        <div className="flex h-52 w-full items-center justify-center">
          <Loader />
        </div>
      ) : (
        <TargetCard isNew={true} />
      )}
      {!isLoading &&
        targets?.map((item) => (
          <TargetCard
            key={item.id}
            targetName={
              item.domain.split(".")[item.domain.split(".").length - 2]
            }
            targetDomain={item.domain}
            lastScanned={item.created_at}
          />
        ))}
    </div>
  );
}
