import React from "react";
import styles from "../../../style";
import Layout from "../../../UIElements/Layout/Layout";
import Form from "./components/Form";

const Sessions = () => {
  return (
    <Layout>
      <div className="w-auto pt-10">
        <div>
          <h1
            className={`${styles.respFontNormal} border-b-2 border-white 
          border-dotted text-white font-bold w-fit`}
          >
            Find your Sessions
          </h1>
        </div>
        <Form />
      </div>
    </Layout>
  );
};

export default Sessions;
