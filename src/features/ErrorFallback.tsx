import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom";
import iconLight from "@/assets/logo/icon-light.svg";
import iconDark from "@/assets/logo/icon-dark.svg";

export default function RootErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();
  // This boundary may render outside the ThemeProvider, so read the applied
  // theme straight off the <html> class instead of the useTheme() hook.
  const logo = document.documentElement.classList.contains("dark")
    ? iconLight
    : iconDark;
  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-2">
        <img src={logo} alt="RedKit Logo" className="h-40 w-40" />
        <h1 className="heading-text text-red">
          {error.status} {error.statusText}
        </h1>
        <p className="large-text">{error.data}</p>
        <button
          className="bg-gray border-dark-yellowish-white rounded-6px cursor-pointer border px-4 py-2 text-white"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-2">
        <img src={logo} alt="RedKit Logo" className="h-32 w-32" />
        <h1 className="heading-text text-red">Error</h1>
        <p className="large-text">{error.message}</p>
        <p className="large-text">The stack trace is:</p>
        <pre className="large-text">{error.stack}</pre>
      </div>
    );
  } else {
    return <h1 className="heading-text text-red">Unknown Error</h1>;
  }
}
