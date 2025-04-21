import { useState, useEffect } from "react";
import Transaction from "../Transaction";
import { supabase } from "../../utils/supabase";
import "./ShowDaily.css";

export default function ShowDaily({ date, onClose }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

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

  const dailyIncome = data.filter(
    (item) => item.day === date && item.type === "수입"
  );
  const dailyExpense = data.filter(
    (item) => item.day === date && item.type === "지출"
  );

  const renderTable = (title, transactions) => {
    if (transactions.length > 0) {
      return (
        <div style={{ marginBottom: "1rem" }}>
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
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          닫기
        </button>
        <h2>{date} 거래 내역</h2>
        {loading && <p>⏳ 로딩 중...</p>}
        {error && <p>❌ 오류 발생: {error}</p>}
        {!loading && !error && (
          <>
            {renderTable("수입", dailyIncome)}
            {renderTable("지출", dailyExpense)}
          </>
        )}
      </div>
    </div>
  );
}
