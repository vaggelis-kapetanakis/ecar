import React, { useState } from "react";
import axios from "axios";
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
import notifierMiddleware from "../../../../../UIElements/Notifier/Notifier";
import { useQuery } from "react-query";
import LoadingSpinner from "../../../../../UIElements/LoadingSpinner/LoadingSpinner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
  scales: {
    x: {
      grid: { color: "rgba(245,245,245,0.3" },
      ticks: {
        color: "whitesmoke",
      },
    },
    y: {
      grid: { color: "rgba(245,245,245,0.3" },
      ticks: {
        color: "whitesmoke",
      },
    },
  },
  plugins: {
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
    legend: {
      display: true,
      position: "top",
      labels: {
        color: "whitesmoke",
        padding: 10,
      },
    },
    title: {
      display: true,
      text: "Total Energy delivered",
      color: "whitesmoke",
      fontSize: "30px",
    },
  },
};

const fetchChartData = (userID) => {
  return axios.get(process.env.REACT_APP_BACKEND_URL + `/data/${userID}`);
};

const Chart = React.memo((userID) => {
  const [chartData, setChartData] = useState({});
  const onSuccess = (data) => {
    data.data?.data.reverse();
    let dataDate = [];
    let dataEn = [];
    if (Object.keys(data.data.data[0]).length === 0) {
      setChartData({
        labels: ["Jan", "Feb"],
        datasets: [
          {
            label: "Energy(kWh)",
            data: ["0", "0"],
            backgroundColor: ["rgba(7, 121, 228,0.5)"],
            borderWidth: 4,
            borderColor: "#0779e4",
            pointBorderColor: "#0779e4",
            pointBackgroundColor: "#0779e4",
            pointHoverBackgroundColor: "#0779e4",
            pointHoverBorderColor: "#0779e4",
            pointBorderWidth: 10,
            pointHoverRadius: 10,
            pointHoverBorderWidth: 1,
            pointRadius: 2,
          },
        ],
      });
    } else {
      for (var i = 12; i > 0; i--) {
        dataEn.push(
          (Math.round(data.data?.data[i].EnergyDelivered * 100) / 100).toFixed(
            2
          )
        );
        dataDate.push(
          data.data?.data[i]._id.year + "-" + data.data?.data[i]._id.month
        );
      }
      /* for (const dataObj of data.data?.data) {
        dataEn.push((Math.round(dataObj.EnergyDelivered * 100) / 100).toFixed(2));
        dataDate.push(dataObj._id.year + "-" + dataObj._id.month);
      } */
      setChartData({
        labels: dataDate,
        datasets: [
          {
            label: "Energy(kWh)",
            data: dataEn,
            backgroundColor: ["rgba(7, 121, 228,0.5)"],
            borderWidth: 4,
            borderColor: "#0779e4",
            pointBorderColor: "#0779e4",
            pointBackgroundColor: "#0779e4",
            pointHoverBackgroundColor: "#0779e4",
            pointHoverBorderColor: "#0779e4",
            pointBorderWidth: 10,
            pointHoverRadius: 10,
            pointHoverBorderWidth: 1,
            pointRadius: 2,
            lineTension: 0.5,
          },
        ],
      });
    }
  };

  const onError = (error) => {
    notifierMiddleware("warning", error.message);
  };

  const { isLoading, isError, error, isFetching } = useQuery(
    "fetch-chart-data",
    () => fetchChartData(userID.userID),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading || isFetching) {
    return (
      <div>
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  if (isError) {
    return notifierMiddleware("warning", error.message);
  }

  return (
    <div className="w-full h-full">
      {Object.keys(chartData).length === 0 ? (
        ""
      ) : (
        <Line options={options} data={chartData} />
      )}
    </div>
  );
});

export default Chart;
