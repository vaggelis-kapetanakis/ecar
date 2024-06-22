import axios from "axios";
import React, { useState, useEffect } from "react";
import styles from "../../../../style";
import LoadingSpinner from "../../../../UIElements/LoadingSpinner/LoadingSpinner";
import notifierMiddleware from "../../../../UIElements/Notifier/Notifier";
import { motion } from "framer-motion";

const InfoLayout = ({ title, data }) => {
  switch (title) {
    case "Website URL":
      return (
        <div
          className="flex flex-row items-start justify-between 
                border-b-2 border-bgBlueLight-400 mb-3"
        >
          <label
            className={`${styles.respFontExtraSmall} text-primary-500 mb-1`}
          >
            {title}:
          </label>
          {data === null ? (
            <h3
              className={`${styles.respFontExtraSmall} text-whitesmoke-500 max-w-[80%] overflow-auto`}
            >
              No entry
            </h3>
          ) : (
            <a
              href={data === null ? "" : data}
              target="_blank"
              rel="noreferrer"
              className={`${styles.respFontExtraSmall} text-success-700`}
            >
              {data}
            </a>
          )}
        </div>
      );
    case "Booking URL":
      return (
        <div
          className="flex flex-row items-start justify-between 
                border-b-2 border-bgBlueLight-400 mb-3"
        >
          <label
            className={`${styles.respFontExtraSmall} text-primary-500 mb-1`}
          >
            {title}:
          </label>
          {data === null ? (
            <h3
              className={`${styles.respFontExtraSmall} text-whitesmoke-500 max-w-[80%] overflow-auto`}
            >
              No entry
            </h3>
          ) : (
            <a
              href={data === null ? "" : data}
              target="_blank"
              rel="noreferrer"
              className={`${styles.respFontExtraSmall} text-success-700`}
            >
              {data}
            </a>
          )}
        </div>
      );

    default:
      return (
        <div
          className="flex flex-row items-start justify-between 
                border-b-2 border-bgBlueLight-400 mb-3"
        >
          <label
            className={`${styles.respFontExtraSmall} text-primary-500 mb-1`}
          >
            {title}:
          </label>
          <h3
            className={`${styles.respFontExtraSmall} text-whitesmoke-500 max-w-[80%] overflow-auto`}
          >
            {data === null ? "No entry" : `${data}`}
          </h3>
        </div>
      );
  }
};

const StationInfo = (props) => {
  const { info } = props;
  const [stationInfo, setStationInfo] = useState({});
  const [operatorInfo, setOperatorInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchStationData = async () => {
    try {
      setLoading(true);
      await axios
        .get(
          process.env.REACT_APP_BACKEND_URL + `/stations/moreinfo/${info._id}`
        )
        .then((res) => {
          setStationInfo(res.data.totalData.stationInfo[0]);
          setOperatorInfo(res.data.totalData.operatorInfo[0]);
          setLoading(false);
        });
    } catch (err) {
      notifierMiddleware("warning", err.message);
    }
  };

  useEffect(() => {
    if (!info) {
      return;
    } else {
      fetchStationData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <div className="overflow-auto">
      {loading && <LoadingSpinner />}
      {Object.keys(stationInfo).length === 0 ? (
        ""
      ) : (
        <motion.div
          initial={{ opacity: 0, translateX: "-150px" }}
          animate={{
            opacity: 1,
            translateX: 0,
            transition: { ease: "backOut", duration: 1.5 },
          }}
          className="mb-5"
        >
          <div className="mb-5">
            <h3
              className={`${styles.respFontSmaller} text-whitesmoke-500 font-bold border-b-2 border-white 
          border-dotted w-fit`}
            >
              Station Info
            </h3>
          </div>
          <InfoLayout title={"Cluster ID"} data={stationInfo.clusterID} />
          <InfoLayout title={"Space ID"} data={stationInfo.spaceID} />
        </motion.div>
      )}
      {Object.keys(operatorInfo).length === 0 ? (
        ""
      ) : (
        <motion.div
          initial={{ opacity: 0, translateX: "-150px" }}
          animate={{
            opacity: 1,
            translateX: 0,
            transition: { ease: "backOut", duration: 1.6 },
          }}
          className="flex flex-col p-2 h-full mt-10"
        >
          <div className="mb-5">
            <h3
              className={`${styles.respFontSmaller} text-whitesmoke-500 font-bold border-b-2 border-white 
          border-dotted w-fit`}
            >
              Operator Info
            </h3>
          </div>
          <InfoLayout title={"Title"} data={operatorInfo.Title} />
          <InfoLayout title={"Website URL"} data={operatorInfo.WebsiteURL} />
          <InfoLayout
            title={"Contact Email"}
            data={operatorInfo.ContactEmail}
          />
          <InfoLayout
            title={"Fault Report Email"}
            data={operatorInfo.FaultReportEmail}
          />
          <InfoLayout title={"Comments"} data={operatorInfo.Comments} />
          <InfoLayout
            title={"Private Individual"}
            data={operatorInfo.IsPrivateIndividual}
          />
          <InfoLayout title={"Booking URL"} data={operatorInfo.BookingURL} />
        </motion.div>
      )}
    </div>
  );
};

export default StationInfo;
