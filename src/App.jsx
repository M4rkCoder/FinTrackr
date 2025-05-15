import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard.jsx";
import IncomeExpense from "./pages/IncomeExpense.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";
import Settings from "./pages/Settings.jsx";
import SaveInvestment from "./pages/SaveInvestment.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import { useAuthStore } from "./utils/useAuthStore.jsx";
import { supabase } from "@/utils/supabase.js";
import "./App.css";

function App() {
  const setUser = useAuthStore((state) => state.setUser);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await fetchUser();
      setLoading(false);
    };

    init();

    // 로그인 상태 실시간 반영
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [fetchUser, setUser]);

  if (loading) return <div>로딩 중...</div>;

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
