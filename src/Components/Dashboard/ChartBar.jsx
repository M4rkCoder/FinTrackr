import React, { useState } from "react";
import {
  XAxis,
  YAxis,
  BarChart,
  Tooltip,
  Bar,
  ResponsiveContainer,
} from "recharts";

export default function ChartBar({ data, onBarClick }) {
  const [toggle, setToggle] = useState("expense");
  const chartData = data.map((item) => ({
    date: new Date(item.date).getDate() + "일",
    originalDate: item.date,
    income: item.daily_income,
    expense: item.daily_expense,
  }));

  const handleBarClick = (data) => {
    if (onBarClick) {
      onBarClick(data.originalDate);
    }
  };
  const handleToggle = () => {
    setToggle((prevToggle) =>
      prevToggle === "expense" ? "income" : "expense"
    );
  };

  return (
    <div style={{ width: "80%" }}>
      <div>
        <button
          onClick={handleToggle}
          style={{
            backgroundColor: toggle === "expense" ? "#A8D5BA" : "#F4A7B9",
            cursor: "pointer",
            padding: "6px 16px",
            border: "none",
            borderRadius: "6px",
            fontWeight: "bold",
          }}
        >
          {toggle === "expense" ? "수입 보기" : "지출 보기"}
        </button>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
        >
          <XAxis
            dataKey="date"
            interval={0}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => v.toLocaleString()}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(v) => `₩${v.toLocaleString()}`}
            cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
          />
          {toggle === "expense" ? (
            <Bar
              dataKey="expense"
              name="지출"
              fill="#F4A7B9"
              activeBar={{ fill: "#6FA98B" }}
              onClick={handleBarClick}
              radius={[6, 6, 0, 0]}
            />
          ) : (
            <Bar
              dataKey="income"
              name="수입"
              fill="#A8D5BA"
              activeBar={{ fill: "#6FA98B" }}
              onClick={handleBarClick}
              radius={[6, 6, 0, 0]}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
