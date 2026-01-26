import useGetCookies from "../hooks/useGetCookies";
import DataRow from "./DataRow";
import Panel from "./Panel";

export type Cookie = {
  name: string;
  value: string;
  attributes: Record<string, string>;
};
const parseHeaderCookies = (cookiesHeader: string[]): Cookie[] => {
  if (!cookiesHeader || !cookiesHeader.length) return [];
  const cookies = cookiesHeader.flatMap((cookieHeader) => {
    return cookieHeader.split(/,(?=\s[A-Za-z0-9]+=)/).map((cookieString) => {
      const [nameValuePair, ...attributePairs] = cookieString
        .split("; ")
        .map((part) => part.trim());
      const [name, value] = nameValuePair.split("=");
      const attributes: Record<string, string> = {};
      attributePairs.forEach((pair) => {
        const [attributeName, attributeValue = ""] = pair.split("=");
        attributes[attributeName] = attributeValue;
      });
      return { name, value, attributes };
    });
  });
  return cookies;
};

export default function CookiesPanel() {
  const { data, isLoading, error } = useGetCookies();
  const headerCookies = parseHeaderCookies(data?.headerCookies || []) || [];
  const clientCookies = data?.clientCookies || [];
  console.log(data);
  return (
    <Panel title="Cookies" isLoading={isLoading} error={error}>
      {headerCookies.map((cookie: Cookie) => {
        const attributes = Object.keys(cookie.attributes).map((key: string) => {
          return [key, cookie.attributes[key]];
        });
        return (
          <DataRow
            label={cookie.name}
            value={cookie.value}
            rowList={attributes}
          />
        );
      })}
      {clientCookies.map((cookie) => {
        const nameValPairs = Object.keys(cookie).map((key: string) => {
          return [key, cookie[key]];
        });
        return (
          <DataRow
            label={cookie.name}
            value={cookie.value}
            rowList={nameValPairs}
          />
        );
      })}
    </Panel>
  );
}
