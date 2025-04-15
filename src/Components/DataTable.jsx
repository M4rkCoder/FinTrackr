import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import useDataRead from "../utils/useDataRead";
import CircularProgress from "@mui/material/CircularProgress";

const columns = [
  { field: "date", headerName: "날짜", width: 100, editable: true },
  {
    field: "sub_category",
    headerName: "분류",
    width: 100,
    editable: true,
  },
  {
    field: "amount",
    headerName: "금액",
    type: "number",
    width: 100,
    editable: true,
  },
  {
    field: "description",
    headerName: "내역",
    width: 150,
    editable: true,
  },
  {
    field: "remarks",
    headerName: "비고",
    sortable: false,
    width: 120,
  },
];

export default function DataTable({
  year,
  month,
  filterType = "*",
  filterValue = "*",
}) {
  const {
    data: transactions,
    totalAmount,
    loading,
    error,
  } = useDataRead(year, month, filterType, filterValue);

  if (loading) return <CircularProgress color="inherit" />;
  if (error) return <div>❌ 오류 발생: {error}</div>;

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={transactions}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
