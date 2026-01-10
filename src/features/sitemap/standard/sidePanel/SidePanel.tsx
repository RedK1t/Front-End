import useGetEndpoints, { type endpoint } from "../../hooks/useGetEndpoints";
import FolderItem from "./FolderItem";

export default function SidePanel() {
  const { endpoints, isLoading, isError } = useGetEndpoints();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error fetching endpoints</div>;
  }
  function createFolder(endpoints: endpoint[], depth: number = 0) {
    return endpoints.map((endpoint) => {
      if (
        depth !== 0 &&
        (endpoint.children === undefined || endpoint.children.length === 0)
      )
        return;
      return (
        <FolderItem
          key={endpoint.id}
          id={endpoint.url.split("//")[1]}
          withLine={depth !== 0}
          folderName={endpoint.url.split("//")[1].split("/")[depth]}
        >
          {endpoint.children?.map((child) => createFolder([child], depth + 1))}
        </FolderItem>
      );
    });
  }
  return (
    <div className="mx-auto flex w-full flex-col justify-end gap-y-1 overflow-hidden py-5">
      {createFolder(endpoints || [])}
    </div>
  );
}
