import React, { useState, useEffect } from "react";
import { supabase } from "../utils/supabase.js";

export default function TransactionForm() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("sub_category");

      if (error) {
        console.error("실패", error.message);
      } else {
        setCategories(data.map((item) => item.sub_category));
      }
    }

    fetchCategories();
  }, []);

  const [form, setForm] = useState({
    date: "",
    category: "",
    amount: "",
    description: "",
    remarks: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 유효성 검사 예시 (간단히 처리)
    if (!form.date || !form.category || !form.amount) {
      alert("날짜, 카테고리, 금액은 필수 입력입니다.");
      return;
    }

    // 여기서 Supabase insert 가능
    console.log("제출된 값:", form);

    // 초기화
    setForm({
      date: "",
      category: "",
      amount: "",
      description: "",
      remarks: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl mt-6 mx-auto p-4 space-y-4 bg-white shadow-md rounded-lg"
    >
      <h2 className="text-lg font-semibold text-gray-700">
        💸 가계부 기록하기
      </h2>

      {/* 날짜 */}
      <div>
        <label className="block text-sm font-medium text-gray-600">날짜</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="mt-1 w-full border rounded-md p-2 text-sm"
          required
        />
      </div>

      {/* 카테고리 */}
      <div>
        <label className="block text-sm font-medium text-gray-600">
          카테고리
        </label>
        <input
          type="text"
          name="category"
          list="category-list"
          value={form.category}
          onChange={handleChange}
          className="mt-1 w-full border rounded-md p-2 text-sm"
          placeholder="예: 식비, 교통비 등"
          required
        />
        <datalist id="category-list">
          {categories.map((cat, index) => (
            <option key={index} value={cat} />
          ))}
        </datalist>
      </div>

      {/* 금액 */}
      <div>
        <label className="block text-sm font-medium text-gray-600">금액</label>
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          className="mt-1 w-full border rounded-md p-2 text-sm"
          placeholder="예: 12000"
          required
        />
      </div>

      {/* 내역 */}
      <div>
        <label className="block text-sm font-medium text-gray-600">내역</label>
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          className="mt-1 w-full border rounded-md p-2 text-sm"
          placeholder="예: 점심식사, 택시 요금"
        />
      </div>

      {/* 메모 */}
      <div>
        <label className="block text-sm font-medium text-gray-600">메모</label>
        <textarea
          name="remarks"
          value={form.remarks}
          onChange={handleChange}
          className="mt-1 w-full border rounded-md p-2 text-sm"
          placeholder="선택 사항"
          rows={2}
        />
      </div>

      {/* 제출 버튼 */}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
      >
        저장하기
      </button>
    </form>
  );
}
