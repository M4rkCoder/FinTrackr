import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";

export default function Summary({ year, month }) {
  const [categorySummary, setCategorySummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTotals() {
      setLoading(true);
      try {
        const { data, error } = await supabase.rpc("get_main_category_totals", {
          year,
          month,
        });

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
  const totalExpense =
    categorySummary[1].total_amount +
    categorySummary[2].total_amount +
    categorySummary[3].total_amount;
  return (
    <table>
      <thead>
        <tr>
          <th>{categorySummary[0].main_category}</th>
          <th>총 지출</th>
          <th>{categorySummary[2].main_category}</th>
          <th>{categorySummary[1].main_category}</th>
          <th>{categorySummary[3].main_category}</th>
          <th>순수입</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{categorySummary[0].total_amount.toLocaleString()}원</td>
          <td>{totalExpense.toLocaleString()}원</td>
          <td>{categorySummary[2].total_amount.toLocaleString()}원</td>
          <td>{categorySummary[1].total_amount.toLocaleString()}원</td>
          <td>{categorySummary[3].total_amount.toLocaleString()}원</td>
          <td>
            {(categorySummary[0].total_amount - totalExpense).toLocaleString()}
            원
          </td>
        </tr>
      </tbody>
    </table>
  );
}
