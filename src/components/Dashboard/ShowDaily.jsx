import { useState, useEffect } from "react";
import Transaction from "../Transaction";
import useSupabase from "@/utils/useSupabase.js";

export default function ShowDaily({ date, onClose }) {
  const { data, loading, error, fetchData } = useSupabase(
    "monthly_transaction"
  );

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
    if (date) {
      fetchData({ filters: { date: date } });
    }
  }, [date]);

  const dailyIncome = data.filter(
    (item) => item.date === date && item.type === "수입"
  );
  const dailyExpense = data.filter(
    (item) => item.date === date && item.type === "지출"
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
