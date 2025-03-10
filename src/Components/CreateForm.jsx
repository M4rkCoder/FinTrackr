import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { supabase } from "../utils/supabase";

const categories = [
  {
    value: 1,
    label: "급여",
  },
  {
    value: 2,
    label: "상여",
  },
  {
    value: 3,
    label: "수당",
  },
  {
    value: 4,
    label: "기타 수입",
  },
];

export default function CreateForm() {
  const [formData, setFormData] = useState({
    date: "",
    category_id: "",
    amount: "",
    description: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { date, category_id, amount, description } = formData;

    const { data, error } = await supabase
      .from("transactions")
      .insert([{ date, category_id, amount, description }]);

    if (error) {
      console.error("Supabase 에러:", error.message);
      alert("데이터 저장에 실패했습니다.");
    } else {
      alert("지출이 성공적으로 추가되었습니다!");
      setFormData({ date: "", category_id: "", amount: "", description: "" }); // 입력값 초기화
    }
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          required
          id="date"
          type="date"
          name="date"
          label="날짜"
          value={formData.date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          required
          id="분류"
          select
          name="category_id"
          label="분류"
          value={formData.category_id}
          onChange={handleChange}
        >
          {categories.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="amount"
          label="금액"
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
        />
        <TextField
          id="description"
          label="내역"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <Button type="submit" variant="contained" color="primary">
          입력
        </Button>
      </div>
    </Box>
  );
}
