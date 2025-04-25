import "./MonthlyHeader.css";
import "./Dashboard/MonthlySummary.css";

export default function MonthlyHeader({ handleMonthChange, ...search }) {
  return (
    <>
      <h1 className="main-title mt-5">
        <button onClick={() => handleMonthChange(-1)}> &lt; </button>
        <span>
          {search.year}년 {search.month}월
        </span>
        <button onClick={() => handleMonthChange(1)}> &gt; </button>
      </h1>
    </>
  );
}
