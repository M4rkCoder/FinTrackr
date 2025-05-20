import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "@/routes/router";
import AuthProvider from "./utils/AuthProvider";
import AccountProvider from "./utils/AccountProvider";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <AccountProvider>
      <RouterProvider router={router} />
    </AccountProvider>
  </AuthProvider>
);
