import useGetTechStack from "../hooks/useGetTechStack";
import Panel from "./Panel";

export default function TechStackPanel() {
  const { data, isFetching, error, refetch } = useGetTechStack();
  const technologies = data?.technologies || [];
  const iconsCdn = "https://www.wappalyzer.com/images/icons/";
  return (
    <Panel
      title="Tech Stack"
      isFetching={isFetching}
      error={error}
      refetch={refetch}
    >
      {technologies.map((tech, index) => {
        return (
          <div key={`tech-stack-row-${index}`}>
            <div className="r1">
              <h4>
                {tech.name}
                <span className="tech-version">
                  {tech.version ? `(v${tech.version})` : ""}
                </span>
              </h4>
              <span
                className="tech-confidence"
                title={`${tech.confidence}% certain`}
              >
                Certainty: {tech.confidence}%
              </span>
              <span className="tech-categories">
                {tech.categories.map(
                  (cat, i) =>
                    `${cat.name}${i < tech.categories.length - 1 ? ", " : ""}`,
                )}
              </span>
            </div>
            <div className="r2">
              <img
                className="tech-icon"
                width="10"
                src={`${iconsCdn}${tech.icon}`}
                alt={tech.name}
              />
              <div>
                <p className="tech-description">{tech.description}</p>
                <p className="tech-website">
                  Learn more at: <a href={tech.website}>{tech.website}</a>
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </Panel>
  );
}
