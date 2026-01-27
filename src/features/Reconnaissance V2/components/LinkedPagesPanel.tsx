import useGetLinkedPages from "../hooks/useGetLinkedPages";
import DataRow from "./DataRow";
import Panel from "./Panel";

const getPathName = (link: string) => {
  try {
    const url = new URL(link);
    return url.pathname;
  } catch {
    return link;
  }
};

export default function LinkedPagesPanel() {
  const { data, isLoading, error } = useGetLinkedPages();
  const internal = data?.internal || [];
  const external = data?.external || [];
  return (
    <Panel title="Linked Pages" isLoading={isLoading} error={error}>
      <h3>Summary</h3>
      <DataRow label="Internal Link Count" value={internal.length} />
      <DataRow label="External Link Count" value={external.length} />
      {internal && internal.length > 0 && (
        <DataRow label="Internal Links" value="">
          {internal.map((link: string) => (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="normal-text text-dark-yellowish-white bg-dark-yellowish-white/10 rounded-6px flex items-center justify-between px-2 py-1 text-wrap break-all"
            >
              {getPathName(link)}
            </a>
          ))}
        </DataRow>
      )}
      {external && external.length > 0 && (
        <DataRow label="External Links" value="">
          {external.map((link: string) => (
            <a
              href={link}
              target="_blank"
              rel="noreferrer"
              className="normal-text text-dark-yellowish-white bg-dark-yellowish-white/10 rounded-6px flex items-center justify-between px-2 py-1 text-wrap break-all"
            >
              {link}
            </a>
          ))}
        </DataRow>
      )}
    </Panel>
  );
}
