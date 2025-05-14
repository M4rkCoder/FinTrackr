import React, { useEffect, useState } from "react";
import TransactionTable from "../components/IncomeExpense/TransactionTable.jsx";
import TransactionSheet from "@/components/IncomeExpense/TransactionSheet.jsx";
import useSupabase from "@/utils/useSupabase.js";
import { DateRangePicker } from "@/components/ui/date-range-picker.jsx";
import { differenceInDays, format } from "date-fns";
import { Separator } from "@/components/ui/separator.jsx";

function IncomeExpense() {
  const [open, setOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [dateRange, setDateRange] = useState({
    from: "2024-01-01",
    to: "2024-02-01",
  });
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
          dateRange: { from: dateRange.from, to: dateRange.to },
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
      filters: {
        dateRange: { from: dateRange.from, to: dateRange.to },
      },
    });
  }, [dateRange]);
  if (loading) return <p>⏳ 로딩 중...</p>;
  if (error) return <p>❌ 오류 발생: {error}</p>;
  return (
    <section>
      <div className="flex flex-col w-[80%] justify-between mx-auto mt-4">
        <div className="flex flex-row justify-between">
          <h2 className="text-3xl font-semibold tracking-tight pb-2 text-left">
            수입/지출
          </h2>
          <DateRangePicker
            initialDateFrom={dateRange.from}
            initialDateTo={dateRange.to}
            onUpdate={(values) => {
              const { from, to } = values.range;

              if (!from || !to) {
                return;
              }

              //validate date range
              if (differenceInDays(to, from) > 90) {
                console.error(
                  `The selected date range is too big. Max allowed range is 90 days!`
                );
                return;
              }
              const formattedFrom = format(from, "yyyy-MM-dd");
              const formattedTo = format(to, "yyyy-MM-dd");

              setDateRange({ from: formattedFrom, to: formattedTo });
            }}
          />
        </div>
        <Separator className="mt-4" />
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
