import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import IncomeExpense from "./pages/IncomeExpense.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";
import Settings from "./pages/Settings.jsx";
import SaveInvestment from "./pages/SaveInvestment.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/income-expense" element={<IncomeExpense />} />
        <Route path="/save-investment" element={<SaveInvestment />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
