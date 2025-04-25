import React from "react";
import ShowCalendar from "../Components/Dashboard/ShowCalendar.jsx";
import MonthlyHeader from "../Components/MonthlyHeader.jsx";
import MonthlySummary from "../Components/Dashboard/MonthlySummary.jsx";
import "./MonthlyCalendar.css";

function Dashboard({
  search,
  selectedDate,
  handleDateSelect,
  handleMonthChange,
  setSelectedDate,
}) {
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
      </section>
    </>
  );
}

export default Dashboard;
