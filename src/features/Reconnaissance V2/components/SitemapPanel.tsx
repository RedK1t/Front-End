import useGetSitemap from "../hooks/useGetSitemap";
import DataRow from "./DataRow";
import Panel from "./Panel";

export default function SitemapPanel() {
  const { data, isLoading, error } = useGetSitemap();
  const normalSiteMap = data?.urlset?.url || null;
  const siteMapIndex = data?.sitemapindex?.sitemap || null;

  const makeExpandableRowData = (site: {
    lastmod: string[];
    changefreq: string[];
    priority: number[];
  }) => {
    const results = [];
    if (site.lastmod) {
      results.push(["Last Modified", site.lastmod[0]]);
    }
    if (site.changefreq) {
      results.push(["Change Frequency", site.changefreq[0]]);
    }
    if (site.priority) {
      results.push(["Priority", site.priority[0]]);
    }
    return results;
  };

  const getPathFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname;
    } catch {
      return url;
    }
  };

  return (
    <Panel title="Sitemap" isLoading={isLoading} error={error}>
      {normalSiteMap &&
        normalSiteMap.map((subpage, index) => {
          return (
            <DataRow
              label={getPathFromUrl(subpage.loc[0])}
              key={index}
              value=""
              rowList={makeExpandableRowData(subpage)}
            ></DataRow>
          );
        })}
      {siteMapIndex && (
        <p>This site returns a sitemap index, which is a list of sitemaps.</p>
      )}
      {siteMapIndex &&
        siteMapIndex.map((subpage) => (
          <a
            href={subpage.loc[0]}
            target="_blank"
            rel="noreferrer"
            className="normal-text text-dark-yellowish-white bg-dark-yellowish-white/10 rounded-6px flex items-center justify-between px-2 py-1 text-wrap break-all"
          >
            {getPathFromUrl(subpage.loc[0])}
          </a>
        ))}
    </Panel>
  );
}
