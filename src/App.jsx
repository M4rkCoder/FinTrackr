import { useState } from "react";
import Monthly from "./Monthly.jsx";
import ShowCalendar from "./Components/ShowCalendar.jsx";
import MonthlyHeader from "./Components/MonthlyHeader.jsx";
import "./App.css";

function App() {
  const [search, setSearch] = useState({
    year: 2024,
    month: 1,
    filterType: "main_category",
    filterValue: "*",
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const handleSearch = (year, month) => {
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
    handleSearch(newYear, newMonth);
  };

  return (
    <>
      <header id="header">
        <MonthlyHeader
          {...search}
          handleSearch={handleSearch}
          handleMonthChange={handleMonthChange}
        />
      </header>
      <section id="main">
        {/* <Monthly {...search} handleSearch={handleSearch} /> */}
        <ShowCalendar
          {...search}
          handleSearch={handleSearch}
          handleMonthChange={handleMonthChange}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </section>
    </>
  );
}

export default App;
