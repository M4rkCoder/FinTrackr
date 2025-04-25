import React, { useEffect, useState } from "react";
import TransactionTable from "../Components/IncomeExpense/TransactionTable.jsx";
import MonthlyHeader from "../Components/MonthlyHeader.jsx";
import { supabase } from "../utils/supabase.js";

function IncomeExpense({ search, handleMonthChange }) {
  const { year, month } = search;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("monthly_transaction")
          .select("*")
          .eq("month", `${year}-${month.toString().padStart(2, "0")}-01`);

        if (error) throw error;
        setData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [year, month]);
  if (loading) return <p>⏳ 로딩 중...</p>;
  if (error) return <p>❌ 오류 발생: {error}</p>;
  return (
    <section>
      <MonthlyHeader {...search} handleMonthChange={handleMonthChange} />
      <TransactionTable data={data} />
    </section>
  );
}

export default IncomeExpense;
