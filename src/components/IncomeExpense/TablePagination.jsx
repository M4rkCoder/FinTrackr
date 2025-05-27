import { Button } from "../ui/button";

export default function TablePagination({ table }) {
  return (
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
  );
}
