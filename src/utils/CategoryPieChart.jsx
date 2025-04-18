import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryPieChart = ({ type, data }) => {
  const filteredData = data.filter((item) => item.type === type);
  const chartData = {
    labels: filteredData.map((item) => item.category),
    datasets: [
      {
        label: "",
        data: filteredData.map((item) => item.amount),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: null,
      },
    },
  };

  return (
    <div style={{ width: "100px", margin: "0 auto" }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default CategoryPieChart;
