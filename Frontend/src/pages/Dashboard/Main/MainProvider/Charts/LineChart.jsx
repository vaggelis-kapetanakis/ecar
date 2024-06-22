import React from "react";
import { motion } from "framer-motion";
import {
  provLineProdData,
  prodData,
  totalProduction,
} from "../../../../../constants/data/prov-line-chart-prod-data";
import { ResponsiveLine } from "@nivo/line";

const LineChart = () => {
  return (
    <div>
      <ResponsiveLine
        data={provLineProdData}
        theme={{
          axis: {
            domain: {
              line: {
                stroke: "#0779e4",
              },
            },
            legend: {
              text: {
                fill: "#ffffff",
              },
            },
            ticks: {
              line: {
                stroke: "#00ff00",
                strokeWidth: 1,
              },
              text: {
                fill: "#0000ff",
              },
            },
          },
          legends: {
            text: {
              fill: "#ffffff",
            },
          },
          tooltip: {
            container: {
              color: "#ff0000",
            },
          },
        }}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: 6,
          max: 10,
          stacked: false,
          reverse: false,
        }}
        /* yFormat=" >-.2f" */
        curve="cardinal"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: "bottom",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "transportation",
          legendOffset: 36,
          legendPosition: "middle",
        }}
        axisLeft={{
          orient: "left",
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "count",
          legendOffset: -40,
          legendPosition: "middle",
        }}
        pointSize={10}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        pointLabelYOffset={-12}
        useMesh={true}
        enableGridX={false}
        enableGridY={false}
        colors={[
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
        ]}
        legends={[
          {
            anchor: "top-right",
            direction: "column",
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: "left-to-right",
            itemWidth: 100,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: "circle",
            symbolBorderColor: "rgba(255, 255,255, 1)",
            effects: [
              {
                on: "hover",
                style: {
                  itemBackground: "rgba(0, 0, 0, .03)",
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default LineChart;
