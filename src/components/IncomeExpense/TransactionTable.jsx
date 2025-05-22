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
import { Badge } from "../ui/badge";
import { Trash2, Pencil, SmilePlus } from "lucide-react";
import clsx from "clsx";

export default function TransactionTable({
  data,
  onRemove,
  onEdit,
  onOpenChange,
}) {
  const [filter, setFilter] = useState("");
  const [selectedRowIds, setSelectedRowIds] = useState(new Set());
  const headerCheckboxRef = useRef(null);

  const filteredData = useMemo(() => {
    if (!filter.trim()) return data;
    const lowerFilter = filter.toLowerCase();
    return data.filter((row) => {
      return (
        row.description?.toLowerCase().includes(lowerFilter) ||
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
    if (!idsToDelete.length) return;

    const { error } = await onRemove(idsToDelete);

    if (!error) {
      setSelectedRowIds(new Set());
    }
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
              onClick={(e) => e.stopPropagation()}
              onCheckedChange={toggleSelectAll}
              aria-label="전체 선택"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            <Checkbox
              checked={selectedRowIds.has(row.original.id)}
              onClick={(e) => e.stopPropagation()}
              onCheckedChange={() => toggleSelectRow(row.original.id)}
              aria-label="행 선택"
            />
          </div>
        ),
        size: 10,
      },
      {
        accessorKey: "date",
        header: "날짜",
        cell: (info) => {
          const date = new Date(info.getValue());
          return (
            <span className="text-sm">
              {date.toLocaleDateString("ko-KR")}
              {/* {date.getMonth() + 1}. {date.getDate()}. */}
            </span>
          );
        },
        size: 80,
      },
      {
        accessorKey: "type",
        header: "분류",
        cell: (info) => {
          const type = info.getValue();
          const isIncome = type === "수입";
          return (
            <Badge variant={isIncome ? "income" : "expense"}>{type}</Badge>
          );
        },
        size: 80,
      },
      {
        accessorKey: "sub_category",
        header: "카테고리",
        cell: ({ row }) => {
          const emoji = row.original.emoji || (
            <SmilePlus size={18} color="gray" />
          );
          const category = row.original.sub_category || "없음";
          return (
            <span className="flex items-center gap-1">
              <span>{emoji}</span>
              <span>{category}</span>
            </span>
          );
        },
        size: 120,
      },
      {
        accessorKey: "amount",
        header: "금액",
        cell: (info) => (
          <span className="font-semibold text-sm">
            {info.getValue().toLocaleString()}
          </span>
        ),
        size: 120,
      },
      {
        accessorKey: "description",
        header: "내역",
        size: 150,
        cell: (info) => (
          <span className="block truncate max-w-[150px]">
            {info.getValue()}
          </span>
        ),
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
        size: 50,
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
      <div className="w-[80%] flex justify-between gap-2">
        <Input
          placeholder="내역, 카테고리 검색..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-[60%]"
        />
        <div className="flex flex-row gap-2">
          <Button
            variant="default"
            disabled={selectedRowIds.size === 0}
            onClick={handleDeleteSelected}
          >
            <Trash2 size={16} className="mr-1" />
            삭제
          </Button>
          <Button
            variant="default"
            onClick={onOpenChange}
            className="bg-black hover:bg-dark text-light gap-2"
          >
            <Pencil size={16} /> 입력
          </Button>
        </div>
      </div>

      {/* 📋 테이블 */}
      <div className="w-[80%] rounded-md border">
        <Table className="table-fixed w-full">
          <TableHeader className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={clsx(
                      "font-semibold",
                      header.column.id === "select" && "w-[40px]",
                      header.column.id === "date" && "w-[100px]",
                      header.column.id === "type" && "w-[80px]",
                      header.column.id === "sub_category" && "w-[120px]",
                      header.column.id === "amount" && "w-[100px]",
                      header.column.id === "description" && "w-[200px]",
                      header.column.id === "remarks" && "w-[60px]"
                    )}
                  >
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
              <TableRow
                key={row.id}
                onClick={() => {
                  onEdit(row.original);
                }}
                className="cursor-pointer hover:bg-zinc-100"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={clsx(
                      cell.column.id === "select" && "w-[40px]",
                      cell.column.id === "date" && "w-[100px]",
                      cell.column.id === "type" && "w-[80px]",
                      cell.column.id === "sub_category" && "w-[120px]",
                      cell.column.id === "amount" && "w-[100px]",
                      cell.column.id === "description" && "w-[200px]",
                      cell.column.id === "remarks" && "w-[60px]"
                    )}
                  >
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
