import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./features/home/Home";
import Reconnaissance from "./features/Reconnaissance/Reconnaissance";
import AppLayout from "./features/AppLayout";
import Sitemap from "./features/sitemap/Sitemap";
import Standard from "./features/sitemap/Standard";
import Hierarchical from "./features/sitemap/hierarchical/Hierarchical";
import Scope from "./features/scope/Scope";
import Interceptor from "./features/Interceptor/Interceptor";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/Reconnaissance",
        element: <Reconnaissance />,
      },
      {
        path: "/proxy",
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
        ],
      },
    ],
  },
]);

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />

        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
}
