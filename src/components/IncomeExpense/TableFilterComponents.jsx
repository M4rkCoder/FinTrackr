import { Badge } from "../ui/badge";
import { DataTableFacetedFilter } from "./DataTableFacetedFilter";

export const renderedCategoryFilter = ({ column, categoryOptions }) => (
  <DataTableFacetedFilter
    column={column}
    title="카테고리"
    options={categoryOptions}
  />
);

export const renderedTypeFilter = ({ column }) => (
  <DataTableFacetedFilter
    column={column}
    title="분류"
    options={[
      {
        value: "수입",
        label: <Badge variant="income">수입</Badge>,
      },
      {
        value: "지출",
        label: <Badge variant="expense">지출</Badge>,
      },
    ]}
  />
);
