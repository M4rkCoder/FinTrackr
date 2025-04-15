import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { supabase } from "../utils/supabase";
import { format } from "date-fns";
import "./ShowCalendar.css";
import ShowDaily from "./ShowDaily";

export default function ShowCalendar({
  year,
  month,
  handleDateSelect,
  selectedDate,
  setSelectedDate,
}) {
  const [value, setValue] = useState(new Date(year, month - 1, 1));
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setValue(new Date(year, month - 1, 1));
  }, [year, month]);

  useEffect(() => {
    async function fetchDaily() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("daily_summary")
          .select("*")
          .eq("month", `${year}-${month.toString().padStart(2, "0")}-01`);

        if (error) throw error;
        setData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDaily();
  }, [year, month]);

  const handleCalendarChange = (newDate) => {
    const newYear = newDate.getFullYear();
    const newMonth = newDate.getMonth() + 1; // getMonth는 0부터 시작하므로 +1 해줍니다.
    setValue(newDate);
    setSelectedDate(format(newDate, "yyyy-MM-dd"));
    if (newYear !== year || newMonth !== month) {
      handleDateSelect(newYear, newMonth);
    }
  };
  if (loading) return <p>⏳ 로딩 중...</p>;
  if (error) return <p>❌ 오류 발생: {error}</p>;

  return (
    <div className="calendarView">
      <Calendar
        navigationLabel={() => null}
        prevLabel={null}
        nextLabel={null}
        prev2Label={null}
        next2Label={null}
        onChange={handleCalendarChange}
        onClickDay={handleCalendarChange}
        value={value}
        formatDay={(locale, date) => format(date, "d")}
        calendarType="gregory"
        tileContent={({ date, view }) => {
          if (view === "month") {
            const formattedDate = format(date, "yyyy-MM-dd");
            const dailyData = data.find((item) => item.day === formattedDate);

            if (!dailyData) return null;

            return (
              <div style={{ fontSize: "12px", marginTop: "4px" }}>
                {dailyData.daily_income > 0 && (
                  <div style={{ color: "green" }}>
                    {dailyData.daily_income.toLocaleString()}
                  </div>
                )}
                {dailyData.daily_expense > 0 && (
                  <div style={{ color: "red" }}>
                    {dailyData.daily_expense.toLocaleString()}
                  </div>
                )}
              </div>
            );
          }
          return null;
        }}
        tileClassName={({ date, view }) => {
          if (view === "month") {
            const day = date.getDay();
            if (day === 6) return "saturday";
            return "calendar-cell";
          }
          return null;
        }}
      />
      {selectedDate && <ShowDaily key={selectedDate} date={selectedDate} />}
    </div>
  );
}
