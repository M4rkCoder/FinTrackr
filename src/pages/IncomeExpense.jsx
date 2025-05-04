import React, { useEffect, useState } from "react";
import TransactionTable from "../components/IncomeExpense/TransactionTable.jsx";
import MonthlyHeader from "../components/MonthlyHeader.jsx";
import TransactionModal from "@/components/TransactionModal.jsx";
import { supabase } from "../utils/supabase.js";
import { Pencil } from "lucide-react";

function IncomeExpense({ search, handleMonthChange }) {
  const { year, month } = search;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

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
  useEffect(() => {
    fetchData();
  }, [year, month]);
  if (loading) return <p>⏳ 로딩 중...</p>;
  if (error) return <p>❌ 오류 발생: {error}</p>;
  return (
    <section>
      <MonthlyHeader {...search} handleMonthChange={handleMonthChange} />
      <TransactionTable data={data} onDataChange={setData} />
      <TransactionModal
        open={open}
        onOpenChange={setOpen}
        onAdd={() => {
          fetchData();
        }}
      />
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-brand hover:bg-dark text-light rounded-full p-4 shadow-lg text-xl"
      >
        <Pencil size={24} />
      </button>
    </section>
  );
}

export default IncomeExpense;
