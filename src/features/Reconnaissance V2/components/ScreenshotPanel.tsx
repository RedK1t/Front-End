import useGetScreenshot from "../hooks/useGetScreenshot";
import Panel from "./Panel";

export default function ScreenshotPanel() {
  const { data, isFetching, error, refetch } = useGetScreenshot();

  return (
    <Panel
      title="Screenshot"
      isFetching={isFetching}
      error={error}
      refetch={refetch}
    >
      {data?.image && (
        <img
          src={data.image}
          alt="Website screenshot"
          loading="lazy"
          className="rounded-6px w-full border border-black/40"
        />
      )}
    </Panel>
  );
}
