import React, { useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Chart from "../../Chart/Chart";
import { AuthContext } from "../../../../../../shared/context/auth-context";
import notifierMiddleware from "../../../../../../UIElements/Notifier/Notifier";
import styles from "../../../../../../style";

function PointInfo(props) {
  const auth = useContext(AuthContext);
  const { geoData, info } = props;
  const [extraDetails, setExtraDetails] = useState({
    duration: "",
    distance: "",
    instruction: [],
  });
  let IsFastCharge = " ";
  let Level = " ";
  let kWhCost = " ";
  let pointID = " ";
  let stationID = " ";
  let totalInstruction = [];

  React.useEffect(() => {
    let totalDistance = 0;
    let totalDuration = 0;
    if (!info) {
      return;
    } else {
      const fetchData = async () => {
        await axios
          .get(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${geoData.geoData.long},${geoData.geoData.lat};${info.longitude},${info.latitude}?access_token=pk.eyJ1Ijoic2oyNCIsImEiOiJja2x4azJuc2IwajdjMnFseXQ2azRucHFxIn0.vDbprHJkosfRkr7XbGp4qw&geometries=geojson&steps=true`
          )
          .then((res) => {
            if (res.data.routes[0].legs[0].steps) {
              for (
                var i = 0;
                i < res.data.routes[0].legs[0].steps.length;
                i++
              ) {
                totalDistance =
                  totalDistance + res.data.routes[0].legs[0].steps[i].distance;
                totalDuration =
                  totalDuration + res.data.routes[0].legs[0].steps[i].duration;
                totalInstruction.push(
                  res.data.routes[0].legs[0].steps[i].maneuver.instruction
                );
              }
            }
            setExtraDetails({
              distance: totalDistance,
              duration: totalDuration,
              instruction: totalInstruction,
            });
          })
          .catch((err) => {
            notifierMiddleware("warning", err.message);
          });
      };
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, info]);

  if (!info) {
    IsFastCharge = " ";
    Level = " ";
    kWhCost = " ";
    pointID = " ";
  } else {
    IsFastCharge = `${info.IsFastCharge}`;
    Level = `${info.Level}`;
    kWhCost = `${info.kWhCost}`;
    pointID = `${info.pointID}`;
    stationID = `${info.stationID}`;
  }

  /* const ColoredLine = ({ color }) => (
    <hr
      style={{
        color: color,
        backgroundColor: color,
        height: 3,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
      }}
    />
  ); */

  return (
    <>
      {!info || info.pointID === undefined ? (
        <div className="w-full h-full">
          <Chart userID={auth.userId} />
        </div>
      ) : (
        <div className="w-full h-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 1 },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 1 },
            }}
          >
            <div className="flex flex-row items-start justify-between 
            border-b-2 border-bgBlueLight-400 mb-3">
              <label className={`${styles.respFontExtraSmall} text-primary-500 mb-1`}>Station ID:</label>
              <h3 className={`${styles.respFontExtraSmall} text-whitesmoke-500`}>{stationID}</h3>
            </div>
            <div className="flex flex-row items-start justify-between 
            border-b-2 border-bgBlueLight-400 mb-3">
              <label className={`${styles.respFontExtraSmall} text-primary-500 mb-1`}>Point ID:</label>
              <h3 className={`${styles.respFontExtraSmall} text-whitesmoke-500`}>{pointID}</h3>
            </div>
            <div className="flex flex-row items-start justify-between 
            border-b-2 border-bgBlueLight-400 mb-3">
              <label className={`${styles.respFontExtraSmall} text-primary-500 mb-1`}>Fast Charge: </label>
              <h3 className={`${styles.respFontExtraSmall} text-whitesmoke-500`}>{IsFastCharge}</h3>
            </div>
            <div className="flex flex-row items-start justify-between 
            border-b-2 border-bgBlueLight-400 mb-3">
              <label className={`${styles.respFontExtraSmall} text-primary-500 mb-1`}>Level: </label>
              <h3 className={`${styles.respFontExtraSmall} text-whitesmoke-500`}>{Level}</h3>
            </div>
            <div className="flex flex-row items-start justify-between 
            border-b-2 border-bgBlueLight-400 mb-3">
              <label className={`${styles.respFontExtraSmall} text-primary-500 mb-1`}>Cost per kWh: </label>
              <h3 className={`${styles.respFontExtraSmall} text-whitesmoke-500`}>{kWhCost}</h3>
            </div>
            <div className="flex flex-row items-start justify-between 
            border-b-2 border-bgBlueLight-400 mb-3">
              <label className={`${styles.respFontExtraSmall} text-primary-500 mb-1`}>Distance: </label>
              <h3 className={`${styles.respFontExtraSmall} text-whitesmoke-500`}>
                {extraDetails.distance &&
                  (
                    Math.round(extraDetails.distance * 100) /
                    100 /
                    1000
                  ).toFixed(2) + " km"}
              </h3>
            </div>
            <div className="flex flex-row items-start justify-between 
            border-b-2 border-bgBlueLight-400 mb-3">
              <label className={`${styles.respFontExtraSmall} text-primary-500 mb-1`}>Duration: </label>
              <h3 className={`${styles.respFontExtraSmall} text-whitesmoke-500`}>
                {extraDetails.duration &&
                  (Math.round(extraDetails.duration * 100) / 100 / 60).toFixed(
                    0
                  ) + " min"}
              </h3>
            </div>
            <div className="flex flex-col items-start justify-center">
              <label className="text-primary-500 mb-3">Instructions: </label>
              <ul className="list-decimal">
                {extraDetails.instruction &&
                  extraDetails.instruction.map((item, index) => {
                    return (
                      <li className={`${styles.respFontExtraSmall} text-whitesmoke-500 ml-8 mb-1`} key={index}>
                        {"  " + item}
                      </li>
                    );
                  })}
              </ul>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

export default React.memo(PointInfo);
