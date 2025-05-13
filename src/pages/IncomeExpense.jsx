import React, { useEffect, useState } from "react";
import TransactionTable from "../components/IncomeExpense/TransactionTable.jsx";
import MonthlyHeader from "../components/MonthlyHeader.jsx";
import TransactionSheet from "@/components/IncomeExpense/TransactionSheet.jsx";
import useSupabase from "@/utils/useSupabase.js";
import { DateRangePicker } from "@/components/ui/date-range-picker.jsx";

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
      <div className="flex flex-col w-[80%] justify-between mx-auto mt-4">
        <h2 className="text-3xl font-semibold tracking-tight pb-2 text-left">
          수입/지출
        </h2>
        <MonthlyHeader {...search} handleMonthChange={handleMonthChange} />
      </div>
      <div className="flex justify-end w-[80%] mx-auto mt-3">
        <DateRangePicker />
      </div>
      <TransactionTable
        data={data}
        onRemove={handleRemove}
        onEdit={handleEdit}
        onOpenChange={handleModalOpenChange}
      />
      <TransactionSheet
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
    </section>
  );
}

export default IncomeExpense;
