import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  consData,
  idConsLabels,
  xAxis,
} from "../../../../../constants/data/prov-line-chart-cons-data";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const colors = [
  "#fdd5d5",
  "#fbabab",
  "#fa8080",
  "#f85656",
  "#f62c2c",
  "#c52323",
  "#941a1a",
  "#621212",
  "#310909",
];

const options = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
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
      display: true,
      position: "top",
      labels: {
        color: "whitesmoke",
        padding: 10,
      },
    },
    tooltip: {
      usePointStyle: true,
      callbacks: {
        labelPointStyle: function (context) {
          return {
            pointStyle: "circle",
          };
        },
      },
      padding: 20,
      boxPadding: 10,
      cornerRadius: 15,
    },
    datasets: {
      datalabel: {
        position: "top",
        color: "whitesmoke",
      },
    },
    title: {
      display: true,
      text: "Total Energy Consumption Per Year",
      color: "whitesmoke",
      fontSize: "30px",
    },
  },
};

const LineConsChartJS = () => {
  const chartData = {
    labels: xAxis,
    datasets: [
      {
        label: idConsLabels[0],
        data: consData[0],
        backgroundColor: colors[2],
        borderWidth: 4,
        borderColor: colors[2],
        pointBorderColor: colors[2],
        pointBackgroundColor: colors[2],
        pointHoverBackgroundColor: colors[2],
        pointHoverBorderColor: colors[2],
        pointBorderWidth: 10,
        pointHoverRadius: 10,
        pointHoverBorderWidth: 1,
        pointRadius: 2,
        lineTension: 0.5,
      },
      {
        label: idConsLabels[1],
        data: consData[1],
        backgroundColor: colors[3],
        borderWidth: 4,
        borderColor: colors[3],
        pointBorderColor: colors[3],
        pointBackgroundColor: colors[3],
        pointHoverBackgroundColor: colors[3],
        pointHoverBorderColor: colors[3],
        pointBorderWidth: 10,
        pointHoverRadius: 10,
        pointHoverBorderWidth: 1,
        pointRadius: 2,
        lineTension: 0.5,
      },
      {
        label: idConsLabels[2],
        data: consData[2],
        backgroundColor: colors[4],
        borderWidth: 4,
        borderColor: colors[4],
        pointBorderColor: colors[4],
        pointBackgroundColor: colors[4],
        pointHoverBackgroundColor: colors[4],
        pointHoverBorderColor: colors[4],
        pointBorderWidth: 10,
        pointHoverRadius: 10,
        pointHoverBorderWidth: 1,
        pointRadius: 2,
        lineTension: 0.5,
      },
      {
        label: idConsLabels[3],
        data: consData[3],
        backgroundColor: colors[5],
        borderWidth: 4,
        borderColor: colors[5],
        pointBorderColor: colors[5],
        pointBackgroundColor: colors[5],
        pointHoverBackgroundColor: colors[5],
        pointHoverBorderColor: colors[5],
        pointBorderWidth: 10,
        pointHoverRadius: 10,
        pointHoverBorderWidth: 1,
        pointRadius: 2,
        lineTension: 0.5,
      },
      {
        label: idConsLabels[4],
        data: consData[4],
        backgroundColor: colors[6],
        borderWidth: 4,
        borderColor: colors[6],
        pointBorderColor: colors[6],
        pointBackgroundColor: colors[6],
        pointHoverBackgroundColor: colors[6],
        pointHoverBorderColor: colors[6],
        pointBorderWidth: 10,
        pointHoverRadius: 10,
        pointHoverBorderWidth: 1,
        pointRadius: 2,
        lineTension: 0.5,
      },
    ],
  };
  return (
    <div className="h-[60vh]">
      <Line options={options} data={chartData} />
    </div>
  );
};

export default LineConsChartJS;
