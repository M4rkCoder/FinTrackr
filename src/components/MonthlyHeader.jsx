import "./MonthlyHeader.css";
import "./Dashboard/MonthlySummary.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MonthlyHeader({ handleMonthChange, ...search }) {
  return (
    <>
      <h1 className="main-title mt-5">
        <button
          className="cursor-pointer hover:scale-105 trainsition"
          onClick={() => handleMonthChange(-1)}
        >
          {" "}
          <ChevronLeft />{" "}
        </button>
        <span className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          {search.year}년 {search.month}월
        </span>
        <button
          className="cursor-pointer hover:scale-105 trainsition"
          onClick={() => handleMonthChange(1)}
        >
          {" "}
          <ChevronRight />{" "}
        </button>
      </h1>
    </>
  );
}
