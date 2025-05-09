import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import useSupabase from "@/utils/useSupabase.js";
import { format } from "date-fns";
import "./ShowCalendar.css";
import ShowDaily from "./ShowDaily";
import ChartBar from "./ChartBar";
import SumView from "./SumView";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function ShowCalendar({
  year,
  month,
  handleDateSelect,
  selectedDate,
  setSelectedDate,
}) {
  const [value, setValue] = useState(new Date(year, month - 1, 1));
  const { data, loading, error, fetchData } = useSupabase("daily_summary");

  useEffect(() => {
    setValue(new Date(year, month - 1, 1));
    setSelectedDate(null);
  }, [year, month]);

  useEffect(() => {
    const formattedMonth = `${year}-${month.toString().padStart(2, "0")}-01`;
    fetchData({ month: formattedMonth });
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
    <>
      <SumView year={year} month={month} />
      <div className="mt-4 flex justify-center items-center w-[1000px]">
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
              const dailyData = data.find(
                (item) => item.date === formattedDate
              );

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
      </div>
      <ChartBar data={data} onBarClick={(date) => setSelectedDate(date)} />

      <Dialog
        open={!!selectedDate}
        onOpenChange={(open) => {
          if (!open) setSelectedDate(null);
        }}
      >
        <DialogContent className="max-w-2xl bg-white p-6 rounded-xl shadow-xl">
          <DialogHeader>
            <DialogTitle>{selectedDate} 거래 내역</DialogTitle>
            <DialogDescription className="sr-only">
              {selectedDate} 내역을 보여줍니다.
            </DialogDescription>
          </DialogHeader>
          {selectedDate && (
            <ShowDaily
              date={selectedDate}
              onClose={() => setSelectedDate(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
