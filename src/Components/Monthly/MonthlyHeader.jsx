import MonthlySummary from "./MonthlySummary.jsx";
import "./MonthlyHeader.css";
import "./MonthlySummary.css";

export default function MonthlyHeader({ handleMonthChange, ...search }) {
  return (
    <>
      <h1 className="main-title">
        <button onClick={() => handleMonthChange(-1)}>&lt;</button>
        <span>
          {search.year}년 {search.month}월
        </span>
        <button onClick={() => handleMonthChange(1)}>&gt;</button>
      </h1>
      <MonthlySummary {...search} />
    </>
  );
}
