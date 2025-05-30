import {
  renderedCategoryFilter,
  renderedTypeFilter,
  renderedFixedFilter,
} from "./TableFilterComponents";
import { SmilePlus } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";

export const getTransactionColumns = ({
  selectedRowIds,
  isAllSelected,
  toggleSelectAll,
  toggleSelectRow,
  headerCheckboxRef,
}) => [
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
    filterFn: "arrIncludes",
    meta: {
      filterComponent: renderedTypeFilter,
    },
    cell: (info) => {
      const type = info.getValue();
      const isIncome = type === "수입";
      return <Badge variant={isIncome ? "income" : "expense"}>{type}</Badge>;
    },
    size: 80,
  },
  {
    accessorKey: "sub_category",
    header: "카테고리",
    enableColumnFilter: true,
    filterFn: "arrIncludes",
    meta: {
      filterComponent: renderedCategoryFilter,
    },
    cell: ({ row }) => {
      const emoji = row.original.emoji || <SmilePlus size={18} color="gray" />;
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
    cell: ({ row }) => {
      const description = row.original.description;
      const isFixed = row.original.is_fixed;
      return (
        <div className="flex flex-row items-center mx-auto">
          {isFixed && (
            <Badge
              variant="secondary"
              className="mr-2 text-[8px] font-light bg-brand"
            >
              고정비
            </Badge>
          )}
          <span className="block truncate max-w-[150px]">{description}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "is_fixed",
    header: () => null, // 헤더 숨기기
    cell: () => null, // 셀 숨기기
    filterFn: (row, columnId, filterValue) => {
      const rowValue = row.getValue(columnId); // true 또는 false
      const filterBool = filterValue === "true"; // 문자열 → boolean 변환
      return rowValue === filterBool;
    },
    meta: {
      filterComponent: renderedFixedFilter,
    },
    size: 0,
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
];
