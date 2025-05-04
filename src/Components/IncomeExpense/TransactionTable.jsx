import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { supabase } from "@/utils/supabase";

export default function TransactionTable({ data, onDataChange }) {
  const [filter, setFilter] = useState("");
  const [selectedRowIds, setSelectedRowIds] = useState(new Set());
  const headerCheckboxRef = useRef(null);

  const deleteSelectedRows = async (ids) => {
    if (!ids.length) return;

    const { error } = await supabase
      .from("transactions")
      .delete()
      .in("id", ids);

    if (error) {
      console.error("삭제 실패:", error.message);
    } else {
      console.log("삭제 성공:", ids);
    }
  };

  const filteredData = useMemo(() => {
    if (!filter.trim()) return data;
    const lowerFilter = filter.toLowerCase();
    return data.filter((row) => {
      return (
        row.description?.toLowerCase().includes(lowerFilter) ||
        row.main_category?.toLowerCase().includes(lowerFilter) ||
        row.sub_category?.toLowerCase().includes(lowerFilter)
      );
    });
  }, [data, filter]);

  const toggleSelectRow = (id) => {
    setSelectedRowIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleDeleteSelected = async () => {
    const idsToDelete = Array.from(selectedRowIds);

    await deleteSelectedRows(idsToDelete);

    const newData = data.filter((row) => !idsToDelete.includes(row.id));
    setSelectedRowIds(new Set());
    onDataChange(newData);
  };

  const isAllSelected =
    filteredData.length > 0 &&
    filteredData.every((row) => selectedRowIds.has(row.id));
  const isSomeSelected = filteredData.some((row) => selectedRowIds.has(row.id));
  const isIndeterminate = isSomeSelected && !isAllSelected;

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRowIds(new Set());
    } else {
      const newSet = new Set(filteredData.map((row) => row.id));
      setSelectedRowIds(newSet);
    }
  };

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: () => (
          <div className="flex justify-center">
            <Checkbox
              checked={isAllSelected}
              ref={headerCheckboxRef}
              onCheckedChange={toggleSelectAll}
              aria-label="전체 선택"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            <Checkbox
              checked={selectedRowIds.has(row.original.id)}
              onCheckedChange={() => toggleSelectRow(row.original.id)}
              aria-label="행 선택"
            />
          </div>
        ),
        size: 50,
      },
      {
        accessorKey: "day",
        header: "날짜",
        cell: (info) => {
          const date = new Date(info.getValue());
          return (
            <span className="text-sm">
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
      {
        accessorKey: "main_category",
        header: "대분류",
      },
      {
        accessorKey: "sub_category",
        header: "소분류",
      },
      {
        accessorKey: "amount",
        header: "금액",
        cell: (info) => (
          <span className="font-semibold text-sm">
            {info.getValue().toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: "description",
        header: "내역",
      },
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
    [selectedRowIds, isAllSelected, isSomeSelected]
  );

  const table = useReactTable({
    data: filteredData,
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
    <div className="flex flex-col items-center mt-6 space-y-4 w-full">
      {/* 🔍 필터 인풋 */}
      <div className="w-[80%] flex gap-2">
        <Input
          placeholder="내역, 대분류, 소분류 검색..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <Button
          variant="default"
          className="bg-black text-white hover:bg-zinc-800"
          disabled={selectedRowIds.size === 0}
          onClick={handleDeleteSelected}
        >
          <Trash2 size={16} className="mr-1" />
          삭제
        </Button>
      </div>

      {/* 📋 테이블 */}
      <div className="w-[80%] rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 📄 페이지네이션 */}
      <div className="w-[80%] flex items-center justify-between px-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          이전
        </Button>
        <span className="text-sm text-muted-foreground">
          {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
