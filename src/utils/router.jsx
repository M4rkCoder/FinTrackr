import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import Welcome from "@/pages/welcome";
import RootLayout from "@/pages/RootLayout";
import Dashboard from "@/pages/Dashboard";
import IncomeExpense from "@/pages/IncomeExpense";
import SaveInvestment from "@/pages/SaveInvestment";
import Settings from "@/pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/app",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <Welcome />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "income-expense",
        element: <IncomeExpense />,
      },
      {
        path: "save-investment",
        element: <SaveInvestment />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);
