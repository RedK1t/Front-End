import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./features/home/Home";
import Reconnaissance from "./features/Reconnaissance/Reconnaissance";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/Reconnaissance",
    element: <Reconnaissance />,
  },
]);
export default function App() {
  return <RouterProvider router={router} />;
}
