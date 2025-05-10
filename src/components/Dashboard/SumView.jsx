import { useState, useEffect } from "react";
import useSupabase from "../../utils/useSupabase.js";
import SubSum from "./SubSum.jsx";

export default function SumView({ year, month }) {
  // const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const { data, loading, error, fetchData } = useSupabase(
    "monthly_categorical_summary"
  );

  useEffect(() => {
    fetchData({
      filters: { month: `${year}-${month.toString().padStart(2, "0")}-01` },
    });
  }, [year, month]);
  if (loading) return <p>⏳ 로딩 중...</p>;
  if (error) return <p>❌ 오류 발생: {error}</p>;

  const expenseData = data.filter((item) => item.type === "지출");

  return (
    <>
      <div className="w-[70%] text-left">
        <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          지출 카테고리별
        </h1>
      </div>
      <ul className="grid grid-cols-4 gap-2 w-[70%] mx-auto">
        {expenseData.map((item) => {
          return (
            <SubSum
              key={item.sub_category}
              label={item.sub_category}
              data={item.total_amount}
            />
          );
        })}
      </ul>
    </>
  );
}
