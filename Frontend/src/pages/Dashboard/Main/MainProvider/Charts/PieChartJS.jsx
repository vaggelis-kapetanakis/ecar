import React, { useState, useContext } from "react";
import { AuthContext } from "../../../../../shared/context/auth-context";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import notifierMiddleware from "../../../../../UIElements/Notifier/Notifier";
import { useQuery } from "react-query";
import LoadingSpinner from "../../../../../UIElements/LoadingSpinner/LoadingSpinner";

Chart.register(ArcElement, Tooltip, Legend);

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

const pieOptions = {
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
    legend: {
      display: true,
      position: "right",
      title: {
        color: "whitesmoke",
        padding: 10,
        display: true,
        text: " PIE CHART",
      },
      labels: {
        color: "whitesmoke",
        padding: 10,
      },
    },
  },
  elements: {
    arc: {
      borderWidth: 0,
    },
  },
  datalabels: {
    display: true,
    color: "white",
  },
  pieceLabel: {
    render: "percentage",
    fontColor: "white",
    precision: 2,
  },
};

const fetchPieProvChartData = (userID) => {
  return axios.get(
    process.env.REACT_APP_BACKEND_URL + `/datastations/${userID}`
  );
};

const PieChartJS = () => {
  const auth = useContext(AuthContext);
  const [chartData, setChartData] = useState({});

  const onSuccess = (data) => {
    let dataSt = [];
    let dataEn = [];
    for (const dataObj of data?.data.stationData) {
      dataEn.push(dataObj[0].EnergyDelivered);
      dataSt.push(dataObj[0]._id);
    }
    setChartData({
      labels: dataSt,
      datasets: [
        {
          label: `StationID:`,
          data: dataEn,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: "#fff",
          pointBorderColor: "#ff5349",
          pointBackgroundColor: "#ff5349",
          pointHoverBackgroundColor: "#ff5349",
          pointHoverBorderColor: "#ff5349",
          pointBorderWidth: 10,
          pointHoverRadius: 10,
          pointHoverBorderWidth: 1,
          pointRadius: 2,
        },
      ],
    });
  };

  const onError = (error) => {
    notifierMiddleware("warning", error.message);
  };

  const { isLoading, isError, error, isFetching } = useQuery(
    "fetch-pie-prov-chart-data",
    () => fetchPieProvChartData(auth.userId),
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
    <div>
      {Object.keys(chartData).length === 0 ? (
        ""
      ) : (
        <Pie
          title="Your station's activity"
          data={chartData}
          options={pieOptions}
          style={{ width: "100px", height: "100px" }}
        />
      )}
    </div>
  );
};

export default PieChartJS;
