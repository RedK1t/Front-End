import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./features/ErrorFallback.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback} //the component you want to show
      // when there is an error
      onReset={() => window.location.replace("/")} // function that will reset the app
      // to the root route
    >
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
