import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import Welcome from "@/pages/welcome";
import RootLayout from "@/pages/RootLayout";
import Dashboard from "@/pages/Dashboard";
import IncomeExpense from "@/pages/IncomeExpense";
import SaveInvestment from "@/pages/SaveInvestment";
import Settings from "@/pages/Settings";
import ProtectedRoute from "@/components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    index: true,
    element: <LoginPage />,
  },
  {
    path: "/app",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <RootLayout />,
        children: [
          {
            index: true,
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
    ],
  },
]);
