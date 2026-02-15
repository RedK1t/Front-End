import TargetCard from "./TargetCard";

export default function TargetCardList() {
  return (
    <div className="mx-auto mt-14 flex w-full flex-wrap items-center justify-center gap-4 pb-14 md:w-11/12 lg:justify-start xl:w-10/12">
      <TargetCard isNew={true} />
      <TargetCard
        targetName="Stripe"
        targetDomain="api.stripe.com"
        vulnerabilitiesFound={12}
        lastScanned="2 hours ago"
      />
      <TargetCard
        targetName="Shopify"
        targetDomain="partners.shopify.com"
        vulnerabilitiesFound={28}
        lastScanned="5 hours ago"
      />
      <TargetCard
        targetName="Notion"
        targetDomain="www.notion.so"
        vulnerabilitiesFound={33}
        lastScanned="3 hours ago"
      />
      <TargetCard
        targetName="Zoom"
        targetDomain="zoom.us"
        vulnerabilitiesFound={19}
        lastScanned="1 hour ago"
      />
      <TargetCard
        targetName="Slack"
        targetDomain="slack.com"
        vulnerabilitiesFound={41}
        lastScanned="6 hours ago"
      />
      <TargetCard
        targetName="Trello"
        targetDomain="trello.com"
        vulnerabilitiesFound={25}
        lastScanned="4 hours ago"
      />
      <TargetCard
        targetName="Discord"
        targetDomain="discord.com"
        vulnerabilitiesFound={37}
        lastScanned="2 hours ago"
      />
      <TargetCard
        targetName="GitHub"
        targetDomain="github.com"
        vulnerabilitiesFound={22}
        lastScanned="7 hours ago"
      />
      <TargetCard
        targetName="Dropbox"
        targetDomain="www.dropbox.com"
        vulnerabilitiesFound={31}
        lastScanned="8 hours ago"
      />
    </div>
  );
}
