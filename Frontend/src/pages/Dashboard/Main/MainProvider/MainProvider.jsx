import React from "react";
import styles from "../../../../style";
import BarComparisonChartJS from "./Charts/BarComparisonChartJS";
import LineConsChartJS from "./Charts/LineConsChart";
import LineProdChartJS from "./Charts/LineProdChartJS";
import PieChartJS from "./Charts/PieChartJS";

const MainProvider = () => {
  return (
    <div className="w-auto pt-10">
      <div>
        <h1
          className={`${styles.respFontNormal} border-b-2 border-white 
        border-dotted text-white font-bold w-fit`}
        >
          Dashboard
        </h1>
      </div>
      <div className="lg:grid lg:grid-rows-2 xxs:flex xxs:flex-col gap-10 pb-1 mb-20">
        <div className="lg:grid lg:grid-cols-3 xxs:flex xxs:flex-col gap-5">
          <div className="mt-5 h-full w-full card-shadow bg-navOp-500 px-5 py-4 rounded-xl">
            <div>
              <h1 className={`${styles.respFontSmaller} text-white font-bold mt-5`}>Total delivered energy from your stations</h1>
            </div>
            <PieChartJS />
            <div
              className={`${styles.respFontExtraSmall} text-whitesmoke-500 ml-5 my-5`}
            >
              The values are measured in kWh.
            </div>
          </div>
          <div className="col-span-2 mt-5 h-full w-full card-shadow bg-navOp-500 px-5 py-4 rounded-xl">
            {/*  <LineChart /> */}
            <LineProdChartJS />
            <div
              className={`${styles.respFontExtraSmall} text-whitesmoke-500 ml-5 my-5`}
            >
              The above diagram displays the monthly Energy Production from
              January 2018 till August 2022 as it was recorded by{" "}
              <a
                href="https://www.eia.gov/totalenergy/data/monthly/"
                target="_blank"
                rel="noreferrer"
                className="text-primary-500"
              >
                Eia.gov
              </a>
              .
            </div>
          </div>
        </div>
        <div className="lg:grid lg:grid-cols-2 xxs:flex xxs:flex-col gap-5">
          <div className="mt-5 h-full w-full card-shadow bg-navOp-500 px-5 py-4 rounded-xl">
            <LineConsChartJS />
          </div>
          <div className="mt-5 h-full w-full card-shadow bg-navOp-500 px-5 py-4 rounded-xl">
            <BarComparisonChartJS />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainProvider;
