import React, { useState } from "react";
import styles from "../../../style";
import Layout from "../../../UIElements/Layout/Layout";
import Maps from "./components/Maps";
import StationInfo from "./components/StationInfo";

const Stations = () => {
  const [popupInfo, setPopupInfo] = useState();
  return (
    <Layout>
      <div className="w-auto pt-10">
        <div>
          <h1
            className={`${styles.respFontNormal} border-b-2 border-white 
          border-dotted text-white font-bold w-fit`}
          >
            Stations Overview
          </h1>
        </div>
        <div className="lg:h-[80vh] xxs:h-max mb-20">
          <div className="lg:grid lg:grid-cols-6 xxs:flex xxs:flex-col gap-5 mt-5 h-full w-full card-shadow bg-navOp-500 px-5 py-4 rounded-xl">
            <div className="lg:col-span-4">
              <Maps popupInfo={popupInfo} setPopupInfo={setPopupInfo} />
            </div>
            <div className="col-span-2">
              <StationInfo info={popupInfo} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Stations;
