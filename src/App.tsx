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
import Repeater from "./features/repeater/Repeater";
import Intruder from "./features/intruder/Intruder";
import Tools from "./features/tools/Tools";
import ProxyLayout from "./features/ProxyLayout";
import AIScanner from "./features/AI-Scanner/AIScanner";

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
    path: "/",
    ErrorBoundary: ErrorFallback,
    element: <Home />,
  },
  {
    element: <AppLayout />,
    children: [
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
        <DomainProvider>
          <SubdomainProvider>
            <RouterProvider router={router} />
          </SubdomainProvider>
        </DomainProvider>
      </QueryClientProvider>
    </>
  );
}
