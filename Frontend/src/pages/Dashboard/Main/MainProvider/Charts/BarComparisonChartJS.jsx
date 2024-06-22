import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  totalConsumption,
} from "../../../../../constants/data/prov-line-chart-cons-data";
import { totalProduction } from "../../../../../constants/data/prov-line-chart-prod-data";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: { color: "rgba(245,245,245,0.1)" },
      ticks: {
        color: "whitesmoke",
      },
    },
    y: {
      grid: { color: "rgba(245,245,245,0.1)" },
      ticks: {
        color: "whitesmoke",
      },
    },
  },
  plugins: {
    legend: {
      position: "top",
      labels: {
        color: "whitesmoke",
        padding: 10,
      },
    },
    title: {
      display: true,
      text: "Energy Production compared to Consumption",
      color: "white",
    },
  },
};

const labels = ["2018", "2019", "2020", "2021", "2022"];

const BarComparisonChartJS = () => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Total Production",
        data: totalProduction,
        backgroundColor: "#306699",
        borderWidth: 4,
        borderColor: "#96ccff",
      },
      {
        label: "Total Consumption",
        data: totalConsumption,
        backgroundColor: "#c52323",
        borderWidth: 4,
        borderColor: "#fa8080",
      },
    ],
  };
  return (
    <div className="h-[60vh] text-rose-500">
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default BarComparisonChartJS;
