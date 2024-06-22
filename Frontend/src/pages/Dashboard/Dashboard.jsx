import React from "react";
import Layout from "../../UIElements/Layout/Layout";
import Main from "./Main/Main";

const Dashboard = () => {
  return (
   /*  <div
      className="w-screen h-screen overflow-hidden
    flex flex-row gap-5"
    >
      <Sidebar />
      <div className="w-[85%] h-screen ml-60">
        <Main />
      </div>
    </div> */
    <Layout>
      <Main />
    </Layout>
  );
};

export default Dashboard;
