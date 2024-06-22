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
  prodData,
  xAxis,
  idProdLabels,
} from "../../../../../constants/data/prov-line-chart-prod-data";

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
  "#cde4fa",
  "#9cc9f4",
  "#6aafef",
  "#3994e9",
  "#0779e4",
  "#0661b6",
  "#044989",
  "#03305b",
  "#01182e",
  "#96ccff",
  "#73bbff",
  "#50aaff",
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
      text: "Total Energy Production Per Year",
      color: "whitesmoke",
      fontSize: "30px",
    },
  },
};

const LineProdChartJS = () => {
  const chartData = {
    labels: xAxis,
    datasets: [
      {
        label: idProdLabels[0],
        data: prodData[0],
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
        label: idProdLabels[1],
        data: prodData[1],
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
        label: idProdLabels[2],
        data: prodData[2],
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
        label: idProdLabels[3],
        data: prodData[3],
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
        label: idProdLabels[4],
        data: prodData[4],
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

export default LineProdChartJS;
