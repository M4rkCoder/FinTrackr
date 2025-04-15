import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, TextField, Box, MenuItem } from "@mui/material";
import { supabase } from "../utils/supabase";

export default function DataGrids({
  year = 2024,
  month = 1,
  filterType = "*",
  filterValue = "*",
}) {
  const categories = [
    { value: 1, label: "급여" },
    { value: 2, label: "상여" },
    { value: 3, label: "수당" },
    { value: 4, label: "기타 수입" },
  ];

  const [data, setData] = useState([]); // 데이터 저장
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rows, setRows] = useState([]);

  const [newItem, setNewItem] = useState({
    date: "",
    category_id: "",
    amount: "",
    description: "",
    remarks: "",
  });

  useEffect(() => {
    let isMounted = true;
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [year, month, filterType, filterValue]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.rpc("get_transactions_summary", {
        year,
        month,
        filter_type: filterType,
        filter_value: filterValue,
      });

      if (error) throw new Error(error.message);

      if (data && data.length > 0) {
        setData(data[0]?.transactions || []);
        setTotalAmount(data[0]?.total_amount || 0);
        setRows(data[0]?.transactions || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 2️⃣ 행 데이터 편집 시 실행 (자동 저장)
  const handleEditCell = async (params) => {
    const { id, field, value } = params;
    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    setRows(updatedRows);

    // Supabase 업데이트
    const { error } = await supabase
      .from("transactions")
      .update({ [field]: value })
      .eq("id", id);

    if (error) console.error("Error updating:", error);
  };

  // 🔹 3️⃣ 행 삭제 기능
  const handleDelete = async (id) => {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) console.error("Error deleting:", error);
    else setRows(rows.filter((row) => row.id !== id));
  };

  // 🔹 4️⃣ 새 데이터 추가 기능
  const handleAdd = async () => {
    if (!newItem.amount || !newItem.description) return;

    const { data, error } = await supabase
      .from("transactions")
      .insert([
        {
          date: newItem.date,
          category_id: newItem.category_id,
          amount: Number(newItem.amount),
          description: newItem.description,
          remarks: newItem.remarks,
        },
      ])
      .select("*");

    if (error) console.error("Error inserting:", error);
    else fetchData();
    setNewItem({
      date: "",
      category_id: "",
      amount: "",
      description: "",
      remarks: "",
    });
  };

  // 🔹 5️⃣ DataGrid 설정
  const columns = [
    { field: "date", headerName: "날짜", width: 100, editable: true },
    { field: "sub_category", headerName: "분류", width: 100, editable: true },
    {
      field: "amount",
      headerName: "금액",
      type: "number",
      width: 100,
      editable: true,
    },
    { field: "description", headerName: "내역", width: 150, editable: true },
    { field: "remarks", headerName: "비고", sortable: false, width: 120 },
    {
      field: "actions",
      headerName: "삭제",
      width: 100,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDelete(params.row.id)}
        >
          삭제
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      {/* 🔹 추가 입력 폼 */}
      <Box display="flex" gap={2} marginBottom={2}>
        <TextField
          label="날짜"
          type="date"
          variant="outlined"
          value={newItem.date}
          onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
        />
        <TextField
          label="분류"
          select
          value={newItem.category_id}
          onChange={(e) =>
            setNewItem({ ...newItem, category_id: e.target.value })
          }
        >
          {categories.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="금액(￦)"
          type="number"
          variant="outlined"
          value={newItem.amount}
          onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
        />
        <TextField
          label="내역"
          variant="outlined"
          value={newItem.description}
          onChange={(e) =>
            setNewItem({ ...newItem, description: e.target.value })
          }
        />
        <TextField
          label="비고"
          variant="outlined"
          value={newItem.remarks}
          onChange={(e) => setNewItem({ ...newItem, remarks: e.target.value })}
        />

        <Button variant="contained" onClick={handleAdd}>
          추가
        </Button>
      </Box>

      {/* 🔹 Data Grid (편집 가능) */}
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={25}
        loading={loading}
        processRowUpdate={(newRow) => {
          handleEditCell({
            id: newRow.id,
            field: "amount", // 여기에 필요한 필드 변경
            value: newRow.amount,
          });
          return newRow;
        }}
      />
    </Box>
  );
}
