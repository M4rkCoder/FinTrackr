import React, { useEffect, useState } from "react";
import TransactionTable from "../components/IncomeExpense/TransactionTable.jsx";
import TransactionSheet from "@/components/IncomeExpense/TransactionSheet.jsx";
import useSupabase from "@/utils/useSupabase.js";
import { useSupabaseQuery } from "@/utils/useSupabaseQuery.js";
import { useSupabaseMutation } from "@/utils/useSupabaseMutation.js";
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
  const { data, isLoading, isError, error, refetch } = useSupabaseQuery({
    table: "monthly_transaction",
    filters: {
      dateRange: { from: dateRange.from, to: dateRange.to },
    },
    orderBy: { column: "date", ascending: true },
  });
  const { create, remove, update } = useSupabaseMutation("transactions", [
    ["supabase", "transactions", dateRange],
  ]);

  const handleRemove = async (ids) => {
    const { data, error } = await remove.mutateAsync(ids);

    if (!error) {
      alert("기록 삭제 완료");
      refetch();
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
    refetch();
  }, [dateRange]);
  if (isLoading) return <p>⏳ 로딩 중...</p>;
  if (isError) return <p>❌ 오류 발생: {error.message}</p>;
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
          await refetch();
          setEditRow(null);
        }}
        editRow={editRow}
        update={update}
        create={create}
        onRemove={handleRemove}
      />
    </section>
  );
}

export default IncomeExpense;
