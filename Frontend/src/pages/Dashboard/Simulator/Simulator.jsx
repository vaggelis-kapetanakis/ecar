import React from "react";
import styles from "../../../style";
import Layout from "../../../UIElements/Layout/Layout";
import Form from "./components/Form";

const Simulator = () => {
  return (
    <Layout>
      <div className="w-auto pt-10">
        <div>
          <h1
            className={`${styles.respFontNormal} border-b-2 border-white 
          border-dotted text-white font-bold w-fit`}
          >
            Charging Simulation
          </h1>
        </div>
        <Form />
      </div>
    </Layout>
  );
};

export default Simulator;
