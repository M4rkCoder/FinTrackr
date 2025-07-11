import { useEffect } from "react";
import useSupabase from "@/utils/useSupabase.js";
import "../../utils/CategoryPieChart.jsx";
import CategoryChart from "../../utils/CategoryChart.jsx";
import MonthlySummarySub from "./MonthlySummarySub.jsx";
import "./MonthlySummary.css";

export default function Monthly_Summary({ year, month }) {
  const {
    data: categorySummary,
    loading,
    error,
    fetchData,
  } = useSupabase("monthly_summary");

  useEffect(() => {
    const formattedMonth = `${year}-${month.toString().padStart(2, "0")}-01`;
    fetchData({ filters: { month: formattedMonth } });
  }, [year, month]);

  if (loading) return <p>⏳ 로딩 중...</p>;
  if (error) return <p>❌ 오류 발생: {error}</p>;
  if (!categorySummary || categorySummary.length === 0)
    return <p>데이터가 없습니다.</p>;

  const totals = {
    income: categorySummary[0].total_income,
    expense: categorySummary[0].total_expense,
    savings: categorySummary[0].savings,
    net_income: categorySummary[0].net_income,
  };
  // const categoryData = [
  //   { type: "수입", category: "급여", amount: categorySummary[0].income_1 },
  //   { type: "수입", category: "수당", amount: categorySummary[0].income_2 },
  //   { type: "수입", category: "상여", amount: categorySummary[0].income_3 },
  //   {
  //     type: "수입",
  //     category: "기타 수입",
  //     amount: categorySummary[0].income_4,
  //   },
  //   {
  //     type: "지출",
  //     category: "고정 지출",
  //     amount: categorySummary[0].expense_1,
  //   },
  //   {
  //     type: "지출",
  //     category: "변동 지출",
  //     amount: categorySummary[0].expense_2,
  //   },
  //   {
  //     type: "지출",
  //     category: "용돈 지출",
  //     amount: categorySummary[0].expense_3,
  //   },
  //   {
  //     type: "저축 및 투자",
  //     category: "저축 및 투자",
  //     amount: categorySummary[0].savings,
  //   },
  // ];

  return (
    <div className="w-[80%] justify-between mx-auto mt-4">
      <div className="grid grid-cols-3 gap-2">
        <MonthlySummarySub
          description="수입 - 지출"
          value={totals.net_income}
        />
        <MonthlySummarySub description="수입" value={totals.income} />
        <MonthlySummarySub description="지출" value={totals.expense} />
        {/* <CategoryChart type="수입" total={totals.income} data={categoryData} />
        <CategoryChart type="지출" total={totals.expense} data={categoryData} /> */}
      </div>
    </div>
  );
}
