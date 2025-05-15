import React, { useState, useEffect } from "react";
import ShowCalendar from "../components/Dashboard/ShowCalendar.jsx";
import MonthlyHeader from "../components/MonthlyHeader.jsx";
import MonthlySummary from "../components/Dashboard/MonthlySummary.jsx";
import TransactionSheet from "@/components/IncomeExpense/TransactionSheet.jsx";
import { Pencil } from "lucide-react";
import "./MonthlyCalendar.css";
import registerUser from "@/utils/registerUser.js";

function Dashboard() {
  useEffect(() => {
    registerUser();
  }, []);

  const [open, setOpen] = useState(false);
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
    <>
      <header className="flex flex-col justify-between w-full h-[10%] px-4">
        <MonthlyHeader {...search} handleMonthChange={handleMonthChange} />
        <MonthlySummary {...search} />
      </header>
      <section className="flex flex-col justify-center items-center w-full p-4">
        <ShowCalendar
          {...search}
          handleDateSelect={handleDateSelect}
          handleMonthChange={handleMonthChange}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <TransactionSheet open={open} onOpenChange={setOpen} />
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-brand hover:bg-dark text-light rounded-full p-4 shadow-lg text-xl"
        >
          <Pencil size={24} />
        </button>
      </section>
    </>
  );
}

export default Dashboard;
