import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

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

  return (
    <table>
      <thead>
        <tr>
          <th>총 수입</th>
          <th>총 지출</th>
          <th>고정 소비지출</th>
          <th>비고정 소비지출</th>
          <th>용돈 지출</th>
          <th>순수입(수입 - 지출)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{categorySummary[0].income.toLocaleString()}원</td>
          <td>{categorySummary[0].total_expense.toLocaleString()}원</td>
          <td>{categorySummary[0].expense_1.toLocaleString()}원</td>
          <td>{categorySummary[0].expense_2.toLocaleString()}원</td>
          <td>{categorySummary[0].expense_3.toLocaleString()}원</td>
          <td>{categorySummary[0].net_income.toLocaleString()}원</td>
        </tr>
      </tbody>
    </table>
  );
}
