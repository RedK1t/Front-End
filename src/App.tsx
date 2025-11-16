import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./features/home/Home";
import Reconnaissance from "./features/Reconnaissance/Reconnaissance";
import AppLayout from "./features/AppLayout";
import Sitemap from "./features/sitemap/Sitemap";

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
        path: "/sitemap",
        element: <Sitemap />,
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
