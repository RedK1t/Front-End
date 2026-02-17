import Panel from "./Panel";
import useGetRobotsTxt from "../hooks/useGetRobotsTxt";
import DataRow from "./DataRow";

export default function RobotsTxtPanel() {
  const { data, isFetching, error, refetch } = useGetRobotsTxt();
  const robots = data?.robots || [];

  return (
    <Panel
      title="Robots.txt"
      isFetching={isFetching}
      error={error}
      refetch={refetch}
    >
      {robots.map((row, index) => {
        return (
          <DataRow
            key={`${row.lbl}-${index}`}
            label={row.lbl}
            value={row.val}
          />
        );
      })}
    </Panel>
  );
}
