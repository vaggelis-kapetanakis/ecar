import React from "react";
import styles from "../../../style";
import Layout from "../../../UIElements/Layout/Layout";
import Choropleth from "./Choropleth/Choropleth";

const EnergyCharts = () => {
  return (
    <Layout>
      <div className="w-auto pt-10">
        <div>
          <h1
            className={`${styles.respFontNormal} border-b-2 border-white 
    border-dotted text-white font-bold w-fit`}
          >
            Energy Chart Data
          </h1>
        </div>
        <div className="mt-10">
          <Choropleth />
        </div>
      </div>
    </Layout>
  );
};

export default EnergyCharts;
