import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "@/utils/router";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
