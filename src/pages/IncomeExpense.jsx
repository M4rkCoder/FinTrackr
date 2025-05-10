import React, { useEffect, useState } from "react";
import TransactionTable from "../components/IncomeExpense/TransactionTable.jsx";
import MonthlyHeader from "../components/MonthlyHeader.jsx";
import TransactionModal from "@/components/TransactionModal.jsx";
import useSupabase from "@/utils/useSupabase.js";
import { Pencil } from "lucide-react";

function IncomeExpense({ search, handleMonthChange }) {
  const { year, month } = search;
  const [open, setOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const { data, loading, error, fetchData } = useSupabase(
    "monthly_transaction"
  );
  const { remove, update } = useSupabase("transactions");

  const handleRemove = async (ids) => {
    const { data, error } = await remove(ids);

    if (!error) {
      alert("기록 삭제 완료");
      await fetchData({
        filters: {
          month: `${year}-${month.toString().padStart(2, "0")}-01`,
        },
      });
    }
    return { data, error };
  };

  const handleEdit = (row) => {
    setEditRow(row);
    setOpen(true);
  };

  const handleModalOpenChange = (open) => {
    setOpen(open);
    if (!open) {
      setEditRow(null);
    }
  };

  useEffect(() => {
    fetchData({
      filters: { month: `${year}-${month.toString().padStart(2, "0")}-01` },
    });
  }, [year, month]);
  if (loading) return <p>⏳ 로딩 중...</p>;
  if (error) return <p>❌ 오류 발생: {error}</p>;
  return (
    <section>
      <MonthlyHeader {...search} handleMonthChange={handleMonthChange} />
      <TransactionTable
        data={data}
        onRemove={handleRemove}
        onEdit={handleEdit}
      />
      <TransactionModal
        open={open}
        onOpenChange={handleModalOpenChange}
        onAddOrUpdate={async () => {
          await fetchData({
            filters: {
              month: `${year}-${month.toString().padStart(2, "0")}-01`,
            },
          });
          setEditRow(null);
        }}
        editRow={editRow}
        update={update}
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
