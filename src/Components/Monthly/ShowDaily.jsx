import { useState, useEffect } from "react";
import Transaction from "../Transaction";
import { supabase } from "../../utils/supabase";
import "./ShowCalendar.css";

export default function ShowDaily({ date }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDaily() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("monthly_transaction")
          .select("*")
          .eq("day", date);

        if (error) throw error;
        setData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDaily();
  }, [date]);

  if (loading) return <div className="dailyView">⏳ 로딩 중...</div>;
  if (error) return <p>❌ 오류 발생: {error}</p>;

  const dailyIncome = data.filter(
    (item) => item.day === date && item.type === "수입"
  );
  const dailyExpense = data.filter(
    (item) => item.day === date && item.type === "지출"
  );

  const renderTable = (title, transactions) => {
    if (transactions.length > 0) {
      return (
        <div>
          <h3>{title}</h3>
          <table>
            <thead>
              <tr>
                <th>분류</th>
                <th>금액</th>
                <th>내역</th>
                <th>메모</th>
              </tr>
            </thead>
            <tbody>
              <Transaction transactions={transactions} />
            </tbody>
          </table>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <section className="dailyView">
      <h2 style={{ marginBottom: "1rem" }}>{date}</h2>
      {renderTable("수입", dailyIncome)}
      {renderTable("지출", dailyExpense)}
    </section>
  );
}
