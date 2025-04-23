import { useState } from "react";
import ShowCalendar from "../Components/Dashboard/ShowCalendar.jsx";
import MonthlyHeader from "../Components/Dashboard/MonthlyHeader.jsx";
import "./MonthlyCalendar.css";

function Dashboard() {
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
