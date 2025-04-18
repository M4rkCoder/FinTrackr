import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryChart = ({ type, total, data }) => {
  const centerTextPlugin = {
    id: "centerText",
    beforeDraw: (chart) => {
      const { width } = chart;
      const { height } = chart;
      const ctx = chart.ctx;
      ctx.restore();

      const fontSize = (height / 150).toFixed(2);
      ctx.font = `${fontSize}em sans-serif`;
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#333";

      const text = `${type}\n₩${total.toLocaleString()}`;
      const lines = text.split("\n");
      const lineHeight = 10;

      lines.forEach((line, i) => {
        const textX = Math.round((width - ctx.measureText(line).width) / 2);
        const textY = height / 2 + (i - (lines.length - 1) / 2) * lineHeight;
        ctx.fillText(line, textX, textY);
      });

      ctx.save();
    },
  };
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
    cutout: "70%",
    plugins: {
      legend: {
        position: null,
      },
    },
  };

  return (
    <div style={{ width: "100px", margin: "0 auto" }}>
      <Doughnut
        data={chartData}
        options={options}
        plugins={[centerTextPlugin]}
      />
    </div>
  );
};

export default CategoryChart;
