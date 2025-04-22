import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase.js";
import "../../utils/CategoryPieChart.jsx";
import CategoryChart from "../../utils/CategoryChart.jsx";
import "./MonthlySummary.css";

export default function Monthly_Summary({ year, month }) {
  const [categorySummary, setCategorySummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTotals() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("monthly_summary")
          .select("*")
          .eq("month", `${year}-${month.toString().padStart(2, "0")}-01`);

        if (error) throw error;
        setCategorySummary(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTotals();
  }, [year, month]);

  if (loading) return <p>⏳ 로딩 중...</p>;
  if (error) return <p>❌ 오류 발생: {error}</p>;

  const totals = {
    income: categorySummary[0].total_income,
    expense: categorySummary[0].total_expense,
    savings: categorySummary[0].savings,
    net_income: categorySummary[0].net_income,
  };
  const data = [
    { type: "수입", category: "급여", amount: categorySummary[0].income_1 },
    { type: "수입", category: "수당", amount: categorySummary[0].income_2 },
    { type: "수입", category: "상여", amount: categorySummary[0].income_3 },
    {
      type: "수입",
      category: "기타 수입",
      amount: categorySummary[0].income_4,
    },
    {
      type: "지출",
      category: "고정 지출",
      amount: categorySummary[0].expense_1,
    },
    {
      type: "지출",
      category: "변동 지출",
      amount: categorySummary[0].expense_2,
    },
    {
      type: "지출",
      category: "용돈 지출",
      amount: categorySummary[0].expense_3,
    },
    {
      type: "저축 및 투자",
      category: "저축 및 투자",
      amount: categorySummary[0].savings,
    },
  ];

  return (
    <div className="chartContainer">
      <div className="chartWrapper">
        <CategoryChart type="수입" total={totals.income} data={data} />
        <CategoryChart type="지출" total={totals.expense} data={data} />
      </div>
    </div>
  );
}
