import NewTargetCard from "./NewTargetCard";
import RecentTargetCard from "./RecentTargetCard";

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

  // If the card is new, return a button to open the modal
  if (isNew) {
    return <NewTargetCard />;
  }

  // If the card is not new, return a regular target card
  if (!isNew) {
    const { targetName, targetDomain, vulnerabilitiesFound, lastScanned } =
      props;
    return (
      <RecentTargetCard
        targetName={targetName}
        targetDomain={targetDomain}
        vulnerabilitiesFound={vulnerabilitiesFound}
        lastScanned={lastScanned}
      />
    );
  }
}
