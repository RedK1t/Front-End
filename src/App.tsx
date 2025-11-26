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
      <RouterProvider router={router} />
    </>
  );
}
