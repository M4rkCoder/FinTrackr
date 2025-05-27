import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Pencil } from "lucide-react";
import clsx from "clsx";
import TablePagination from "./TablePagination";
import { getTransactionColumns } from "./TableColumns";

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

  const categoryOptions = useMemo(() => {
    const map = new Map();
    data.forEach((item) => {
      if (item.sub_category) {
        if (!map.has(item.sub_category)) {
          map.set(item.sub_category, {
            label: `${item.emoji} ${item.sub_category}`,
            value: item.sub_category,
          });
        }
      }
    });
    return Array.from(map.values());
  }, [data]);
  // console.log("카테고리옵션:", categoryOptions);

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

  const columns = useMemo(() => {
    return getTransactionColumns({
      selectedRowIds,
      isAllSelected,
      toggleSelectAll,
      toggleSelectRow,
      headerCheckboxRef,
    });
  }, [selectedRowIds]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getPaginationRowModel: getPaginationRowModel(),
    enableColumnFilters: true,
    filterFns: {
      arrIncludes: (row, columnId, filterValue) => {
        const value = row.original[columnId];
        return Array.isArray(filterValue)
          ? filterValue.includes(value)
          : value === filterValue;
      },
    },
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
        {table
          .getAllColumns()
          .filter(
            (col) => typeof col.columnDef.meta?.filterComponent === "function"
          )
          .map((col) => {
            const FilterComponent = col.columnDef.meta?.filterComponent;
            return (
              <FilterComponent
                key={col.id}
                column={col}
                categoryOptions={categoryOptions}
              />
            );
          })}
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

      <TablePagination table={table} />
    </div>
  );
}
