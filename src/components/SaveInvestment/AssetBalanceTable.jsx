import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  format,
  subMonths,
  startOfMonth,
  endOfMonth,
  parseISO,
} from "date-fns";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { useSupabaseQuery } from "@/utils/useSupabaseQuery";

// 최근 월 목록 구하기 함수 (예: ["2024-12", ..., "2025-05"])
const getRecentMonths = (count) => {
  const now = new Date();
  return Array.from({ length: count }, (_, i) =>
    format(subMonths(now, count - i - 1), "yyyy-MM")
  );
};

// 날짜 문자열을 월 포맷으로 변환
const formatMonthLabel = (monthString) => {
  const [_, month] = monthString.split("-");
  return `${parseInt(month)}월`;
};

export default function AssetBalanceTable() {
  const [months, setMonths] = useState(getRecentMonths(6));

  // 📅 dateRange를 months에서 유도
  const dateRange = {
    from: format(startOfMonth(parseISO(months[0] + "-01")), "yyyy-MM-dd"),
    to: format(
      endOfMonth(parseISO(months[months.length - 1] + "-01")),
      "yyyy-MM-dd"
    ),
  };

  // 📡 Supabase 훅
  const { data: rawData = [], isLoading } = useSupabaseQuery({
    table: "asset_view",
    filters: {
      dateRange, // from, to가 포함된 구조여야 훅에서 처리 가능
    },
  });

  // 📊 계좌별, 월별로 그룹핑된 데이터
  const groupedData = useMemo(() => {
    const grouped = {};

    rawData.forEach((row) => {
      const assetId = row.asset_id;
      const month = format(parseISO(row.date), "yyyy-MM");

      if (!grouped[assetId]) {
        grouped[assetId] = {
          asset_id: assetId,
          name: row.name,
          type: row.type,
          institution: row.institution,
        };
      }

      grouped[assetId][month] = row.balance;
    });

    return Object.values(grouped);
  }, [rawData]);
  console.log(groupedData);
  // 📋 컬럼 정의
  const columns = useMemo(
    () => [
      {
        accessorKey: "type",
        header: "분류",
      },
      {
        accessorKey: "name",
        header: "자산명",
      },
      {
        accessorKey: "institution",
        header: "투자처",
      },
      ...months.map((month) => ({
        accessorKey: month,
        header: formatMonthLabel(month),
        cell: (info) =>
          info.getValue() !== undefined
            ? Number(info.getValue()).toLocaleString()
            : "-",
      })),
    ],
    [months]
  );

  // 🧮 TanStack Table 생성
  const table = useReactTable({
    data: groupedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="mt-4">
      {/* 뷰 변경 버튼 */}
      <div className="flex flex-row gap-2">
        <Button onClick={() => setMonths(getRecentMonths(6))}>
          최근 6개월
        </Button>
        <Button onClick={() => setMonths(getRecentMonths(12))}>최근 1년</Button>
      </div>

      {isLoading ? (
        <p>불러오는 중...</p>
      ) : (
        <div className="w-full rounded-md border mt-4">
          <Table className="table-fixed w-full">
            <TableHeader className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="font-bold">
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
                    <TableCell
                      key={cell.id}
                      // style={{
                      //   border: "1px solid #ccc",
                      //   padding: "0.5rem",
                      //   textAlign: "right",
                      // }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
