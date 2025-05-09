import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import IncomeExpense from "./pages/IncomeExpense.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";
import Settings from "./pages/Settings.jsx";
import "./App.css";

function App() {
  const [search, setSearch] = useState({
    year: 2024,
    month: 1,
    filterType: "main_category",
    filterValue: "*",
  });
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateSelect = (year, month) => {
    setSearch({
      ...search,
      year,
      month,
    });

    const formattedDate = `${year}-${month.toString().padStart(2, "0")}-01`;
    setSelectedDate(formattedDate);
  };

  const handleMonthChange = (direction) => {
    let newYear = search.year;
    let newMonth = search.month + direction;

    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    } else if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    setSearch({
      ...search,
      year: newYear,
      month: newMonth,
    });
  };

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard
              search={search}
              selectedDate={selectedDate}
              handleDateSelect={handleDateSelect}
              handleMonthChange={handleMonthChange}
              setSelectedDate={setSelectedDate}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <Dashboard
              search={search}
              selectedDate={selectedDate}
              handleDateSelect={handleDateSelect}
              handleMonthChange={handleMonthChange}
              setSelectedDate={setSelectedDate}
            />
          }
        />
        <Route
          path="/income-expense"
          element={
            <IncomeExpense
              search={search}
              selectedDate={selectedDate}
              handleDateSelect={handleDateSelect}
              handleMonthChange={handleMonthChange}
            />
          }
        />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
