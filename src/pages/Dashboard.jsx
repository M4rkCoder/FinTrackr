import React, { useState } from "react";
import ShowCalendar from "../components/Dashboard/ShowCalendar.jsx";
import MonthlyHeader from "../components/MonthlyHeader.jsx";
import MonthlySummary from "../components/Dashboard/MonthlySummary.jsx";
import TransactionSheet from "@/components/IncomeExpense/TransactionSheet.jsx";
import { Pencil } from "lucide-react";
import "./MonthlyCalendar.css";

function Dashboard({
  search,
  selectedDate,
  handleDateSelect,
  handleMonthChange,
  setSelectedDate,
}) {
  const [open, setOpen] = useState(false);

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
