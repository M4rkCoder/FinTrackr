import * as React from "react";
import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

export function BinaryFacetedFilter({
  column,
  title,
  trueLabel = "예",
  falseLabel = "아니오",
}) {
  const filterValue = column?.getFilterValue(); // "true", "false", or undefined

  const handleFilterChange = (value) => {
    if (filterValue === value) {
      column.setFilterValue(undefined); // 같은 걸 누르면 초기화
    } else {
      column.setFilterValue(value);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <CircleCheck className="mr-2 h-4 w-4" />
          {title}
          {filterValue && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <span className="text-xs text-muted-foreground">
                {filterValue === "true" ? trueLabel : falseLabel}
              </span>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-2" align="start">
        <div className="flex flex-col gap-2">
          <Button
            variant={filterValue === "true" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("true")}
            className="w-full"
          >
            {trueLabel}
          </Button>
          <Button
            variant={filterValue === "false" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFilterChange("false")}
            className="w-full"
          >
            {falseLabel}
          </Button>
          {filterValue && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => column.setFilterValue(undefined)}
              className="w-full text-xs text-muted-foreground"
            >
              필터 초기화
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
