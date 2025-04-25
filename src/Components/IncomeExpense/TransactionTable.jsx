import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

export default function TransactionTable({ data }) {
  const columns = useMemo(
    () => [
      {
        accessorKey: "day",
        header: "날짜",
        cell: (info) => {
          const date = new Date(info.getValue());
          return (
            <span className="text-sm p-1">
              {date.getMonth() + 1}. {date.getDate()}.
            </span>
          );
        },
      },
      {
        accessorKey: "type",
        header: "분류",
        cell: (info) => {
          const type = info.getValue();
          const isIncome = type === "수입";
          return (
            <span
              className={`px-2 py-1 rounded-md text-sm font-medium ${
                isIncome
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {type}
            </span>
          );
        },
      },
      { accessorKey: "main_category", header: "대분류" },
      { accessorKey: "sub_category", header: "소분류" },
      {
        accessorKey: "amount",
        header: "금액",
        cell: (info) => {
          const amount = info.getValue();
          return (
            <span className="font-semibold text-sm p-1">
              {amount.toLocaleString()}
            </span>
          );
        },
      },
      { accessorKey: "description", header: "내역" },
      {
        accessorKey: "remarks",
        header: "메모",
        cell: (info) => {
          const value = info.getValue();
          const isRealValue = value && value.trim() !== "";
          return isRealValue ? (
            <span className="text-gray-400 inline-block px-2" title={value}>
              ...
            </span>
          ) : null;
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 15,
      },
    },
  });

  return (
    <div className="max-w-6xl mx-auto mt-6 overflow-x-auto">
      <div className=" rounded-lg border border-gray-200 shadow-sm">
        <table className=" w-full border-collapse table-auto text-sm">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-gray-100">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left px-6 py-4 font-semibold whitespace-nowrap"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap min-w-[80px]"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-6 mb-6 px-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          이전
        </button>
        <span>
          {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  );
}
