import useGetTechStack from "../hooks/useGetTechStack";
import Panel from "./Panel";

export default function TechStackPanel() {
  const { data, isFetching, error, refetch } = useGetTechStack();
  const technologies = data?.technologies || [
    {
      slug: "drupal",
      name: "Drupal",
      description:
        "Drupal is a free and open-source web content management framework.",
      confidence: 100,
      version: "9",
      icon: "Drupal.svg",
      website: "https://www.drupal.org/",
      cpe: "cpe:2.3:a:drupal:drupal:*:*:*:*:*:*:*:*",
      categories: [
        {
          id: 1,
          slug: "cms",
          name: "CMS",
        },
      ],
      rootPath: true,
    },
    {
      slug: "sentry",
      name: "Sentry",
      description:
        "Sentry is an open-source platform for workflow productivity, aggregating errors from across the stack in real time.",
      confidence: 100,
      version: null,
      icon: "Sentry.svg",
      website: "https://sentry.io/",
      cpe: null,
      categories: [
        {
          id: 13,
          slug: "issue-trackers",
          name: "Issue trackers",
        },
      ],
      rootPath: true,
    },
    {
      slug: "php",
      name: "PHP",
      description:
        "PHP is a general-purpose scripting language used for web development.",
      confidence: 100,
      version: null,
      icon: "PHP.svg",
      website: "https://php.net",
      cpe: "cpe:2.3:a:php:php:*:*:*:*:*:*:*:*",
      categories: [
        {
          id: 27,
          slug: "programming-languages",
          name: "Programming languages",
        },
      ],
    },
    {
      slug: "varnish",
      name: "Varnish",
      description: "Varnish is a reverse caching proxy.",
      confidence: 100,
      version: null,
      icon: "Varnish.svg",
      website: "https://www.varnish-cache.org",
      cpe: "cpe:2.3:a:varnish-software:varnish_cache:*:*:*:*:*:*:*:*",
      categories: [
        {
          id: 23,
          slug: "caching",
          name: "Caching",
        },
      ],
      rootPath: true,
    },
    {
      slug: "react",
      name: "React",
      description:
        "React is an open-source JavaScript library for building user interfaces or UI components.",
      confidence: 100,
      version: "18.3.1",
      icon: "React.svg",
      website: "https://reactjs.org",
      cpe: "cpe:2.3:a:facebook:react:*:*:*:*:*:*:*:*",
      categories: [
        {
          id: 12,
          slug: "javascript-frameworks",
          name: "JavaScript frameworks",
        },
      ],
      rootPath: true,
    },
    {
      slug: "akamai-bot-manager",
      name: "Akamai Bot Manager",
      description:
        "Akamai Bot Manager detect bots using device fingerprinting bot signatures.",
      confidence: 100,
      version: null,
      icon: "Akamai.svg",
      website: "https://www.akamai.com/us/en/products/security/bot-manager.jsp",
      cpe: null,
      categories: [
        {
          id: 16,
          slug: "security",
          name: "Security",
        },
      ],
      rootPath: true,
    },
    {
      slug: "lozad-js",
      name: "Lozad.js",
      description:
        "Lozad.js is a lightweight lazy-loading library that's just 535 bytes minified & gzipped.",
      confidence: 100,
      version: null,
      icon: "default.svg",
      website: "https://apoorv.pro/lozad.js/",
      cpe: null,
      categories: [
        {
          id: 59,
          slug: "javascript-libraries",
          name: "JavaScript libraries",
        },
        {
          id: 92,
          slug: "performance",
          name: "Performance",
        },
      ],
      rootPath: true,
    },
    {
      slug: "lodash",
      name: "Lodash",
      description:
        "Lodash is a JavaScript library which provides utility functions for common programming tasks using the functional programming paradigm.",
      confidence: 100,
      version: "4.17.21",
      icon: "Lodash.svg",
      website: "https://www.lodash.com",
      cpe: "cpe:2.3:a:lodash:lodash:*:*:*:*:*:*:*:*",
      categories: [
        {
          id: 59,
          slug: "javascript-libraries",
          name: "JavaScript libraries",
        },
      ],
      rootPath: true,
    },
    {
      slug: "priority-hints",
      name: "Priority Hints",
      description:
        "Priority Hints exposes a mechanism for developers to signal a relative priority for browsers to consider when fetching resources.",
      confidence: 100,
      version: null,
      icon: "Priority Hints.svg",
      website: "https://wicg.github.io/priority-hints/",
      cpe: null,
      categories: [
        {
          id: 92,
          slug: "performance",
          name: "Performance",
        },
      ],
      rootPath: true,
    },
    {
      slug: "hsts",
      name: "HSTS",
      description:
        "HTTP Strict Transport Security (HSTS) informs browsers that the site should only be accessed using HTTPS.",
      confidence: 100,
      version: null,
      icon: "default.svg",
      website: "https://www.rfc-editor.org/rfc/rfc6797#section-6.1",
      cpe: null,
      categories: [
        {
          id: 16,
          slug: "security",
          name: "Security",
        },
      ],
      rootPath: true,
    },
    {
      slug: "akamai",
      name: "Akamai",
      description:
        "Akamai is global content delivery network (CDN) services provider for media and software delivery, and cloud security solutions.",
      confidence: 100,
      version: null,
      icon: "Akamai.svg",
      website: "https://akamai.com",
      cpe: null,
      categories: [
        {
          id: 31,
          slug: "cdn",
          name: "CDN",
        },
      ],
      rootPath: true,
    },
    {
      slug: "pwa",
      name: "PWA",
      description:
        "Progressive Web Apps (PWAs) are web apps built and enhanced with modern APIs to deliver enhanced capabilities, reliability, and installability while reaching anyone, anywhere, on any device, all with a single codebase.",
      confidence: 100,
      version: null,
      icon: "PWA.svg",
      website: "https://web.dev/progressive-web-apps/",
      cpe: null,
      categories: [
        {
          id: 19,
          slug: "miscellaneous",
          name: "Miscellaneous",
        },
      ],
      rootPath: true,
    },
    {
      slug: "open-graph",
      name: "Open Graph",
      description:
        "Open Graph is a protocol that is used to integrate any web page into the social graph.",
      confidence: 100,
      version: null,
      icon: "Open Graph.png",
      website: "https://ogp.me",
      cpe: null,
      categories: [
        {
          id: 19,
          slug: "miscellaneous",
          name: "Miscellaneous",
        },
      ],
      rootPath: true,
    },
    {
      slug: "http-3",
      name: "HTTP/3",
      description:
        "HTTP/3 is the third major version of the Hypertext Transfer Protocol used to exchange information on the World Wide Web.",
      confidence: 100,
      version: null,
      icon: "HTTP3.svg",
      website: "https://httpwg.org/",
      cpe: null,
      categories: [
        {
          id: 19,
          slug: "miscellaneous",
          name: "Miscellaneous",
        },
      ],
      rootPath: true,
    },
  ];
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
          <div
            key={`tech-stack-row-${index}`}
            className="rounded-6px bg-black/40 p-2"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="mid-text text-light-red">
                {tech.name}
                <span className="normal-text text-dark-yellowish-white ml-1">
                  {tech.version ? `(v${tech.version})` : ""}
                </span>
              </h4>
              <span className="normal-text text-dark-yellowish-white">
                {tech.categories.map(
                  (cat, i) =>
                    `${cat.name}${i < tech.categories.length - 1 ? ", " : ""}`,
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <img
                className="rounded-6px mx-2 min-w-10"
                width="10"
                src={`${iconsCdn}${tech.icon}`}
                alt={tech.name}
              />
              <div>
                <p className="normal-text text-yellowish-white italic">
                  {tech.description}
                </p>
                <p className="normal-text">
                  Learn more at:{" "}
                  <a
                    className="text-blue"
                    target="_blank"
                    rel="noreferrer"
                    href={tech.website}
                  >
                    {tech.website}
                  </a>
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </Panel>
  );
}
