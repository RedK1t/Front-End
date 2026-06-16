import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./features/home/Home";
import Reconnaissance from "./features/Reconnaissance/Reconnaissance";
import ReconnaissanceV2 from "./features/Reconnaissance V2/Reconnaissance";
import AppLayout from "./features/AppLayout";
import Sitemap from "./features/sitemap/Sitemap";
import Standard from "./features/sitemap/Standard";
import Hierarchical from "./features/sitemap/hierarchical/Hierarchical";
import Scope from "./features/scope/Scope";
import Interceptor from "./features/Interceptor/Interceptor";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ErrorFallback from "./features/ErrorFallback";
import { SubdomainProvider } from "./context/SubdomainContext";
import { DomainProvider } from "./context/DomainContext";
import { ThemeProvider } from "./context/ThemeContext";
import { ProxySessionProvider } from "./features/Interceptor/context/ProxySessionContext";
import Repeater from "./features/repeater/Repeater";
import Intruder from "./features/intruder/Intruder";
import Tools from "./features/tools/Tools";
import ProxyLayout from "./features/ProxyLayout";
import AIScanner from "./features/AI-Scanner/AIScanner";
import AiReport from "./features/Ai-Report/AiReport";
import { Login, Signup } from "./features/auth";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    },
  },
});

const router = createBrowserRouter([
  {
    ErrorBoundary: ErrorFallback,
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/Reconnaissance",
        children: [
          {
            path: "",
            element: <Reconnaissance />,
          },
          {
            path: "v2",
            element: <ReconnaissanceV2 />,
          },
        ],
      },
      {
        path: "/proxy",
        element: <ProxyLayout />,
        children: [
          {
            path: "sitemap",
            element: <Sitemap />,
            children: [
              {
                path: "standard",
                element: <Standard />,
              },
              {
                path: "hierarchical",
                element: <Hierarchical />,
              },
            ],
          },
          { path: "scope", element: <Scope /> },
          { path: "interceptor", element: <Interceptor /> },
          { path: "repeater", element: <Repeater /> },
          { path: "intruder", element: <Intruder /> },
        ],
      },
      {
        path: "/AiScanner",
        element: <AIScanner />,
      },
      {
        path: "/AiReport",
        element: <AiReport />,
      },
      {
        path: "/tools",
        element: <Tools />,
      },
    ],
  },
]);

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ThemeProvider>
          <DomainProvider>
            <SubdomainProvider>
              <ProxySessionProvider>
                <RouterProvider router={router} />
              </ProxySessionProvider>
            </SubdomainProvider>
          </DomainProvider>
        </ThemeProvider>
      </QueryClientProvider>
      <Toaster
        toastOptions={{
          // Theme-aware: these tokens flip with the .dark class on <html>, which
          // also cascades to the toast portal — so toasts match both themes
          // instead of always rendering as a white box.
          style: {
            background: "var(--color-gray)",
            color: "var(--color-white)",
            border:
              "1px solid color-mix(in srgb, var(--color-white) 12%, transparent)",
          },
        }}
      />
    </>
  );
}
