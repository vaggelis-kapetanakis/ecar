import React, { useState } from "react";
import notifierMiddleware from "../../../../UIElements/Notifier/Notifier";
import LoadingSpinner from "../../../../UIElements/LoadingSpinner/LoadingSpinner";
import { AuthContext } from "../../../../shared/context/auth-context";
import axios from "axios";
import dateFormatter from "../../../../shared/utils/date-formatter";
import SelectSessionsVehicle from "./SelectSessionsVehicle";
import SessionsResults from "./SessionsResults";
import styles from "../../../../style";

function padTo2Digits(num) {
  return num.toString().padStart(2);
}

function convertMsToTime(milliseconds) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;

  hours = hours % 24;

  let hoursFinal = hours === "00" ? "" : `${padTo2Digits(hours)} h `;
  let minutesFinal = minutes === "00" ? "" : `${padTo2Digits(minutes)} m `;
  let secondsFinal = seconds === "00" ? "" : `${padTo2Digits(seconds)} s `;

  return `${hoursFinal} ${minutesFinal} ${secondsFinal}`;
}

const Form = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const auth = React.useContext(AuthContext);

  const [formData, setFormData] = useState({
    vehicleID: "",
    dateFrom: new Date(2016, 3, 19),
    dateTo: new Date(2021, 4, 26),
    records: [],
    footerInfo: [],
    timeCharging: [],
  });

  const tempState = { ...formData };
  delete tempState.records;

  const StepDisplay = () => {
    if (step === 0) {
      return (
        <SelectSessionsVehicle formData={formData} setFormData={setFormData} />
      );
    } else {
      return <SessionsResults formData={formData} />;
    }
  };

  const prevStepFunction = () => {
    if (step === 0) {
      setStep((currStep) => currStep - 1);
    } else if (step === 1) {
      setStep((currStep) => currStep - 1);
    }
  };

  const getValidation = async () => {
    if (step === 0) {
      if (formData.vehicleID === "") {
        notifierMiddleware("info", "Please provide a Vehicle ID");
      } else {
        setLoading(true);
        const dateFromTemp = dateFormatter(new Date(formData.dateFrom));
        const dateToTemp = dateFormatter(new Date(formData.dateTo));
        await axios
          .get(
            process.env.REACT_APP_BACKEND_URL +
              `/SessionsPerEV/${formData.vehicleID}/${dateFromTemp}/${dateToTemp}`,
            {
              headers: {
                "X-OBSERVATORY-AUTH": `Bearer ${auth.token}`,
              },
            }
          )
          .then((res) => {
            const tempData = [];
            tempData.push(
              res.data.NumberOfVehicleChargingSessions,
              res.data.NumberOfVisitedPoints,
              res.data.TotalEnergyConsumed
            );

            let timeChargingTemp = [];
            let dataTemp = res.data.VehicleChargingSessionsList;

            res.data.VehicleChargingSessionsList.forEach((item) => {
              timeChargingTemp.push(
                convertMsToTime(
                  new Date(item.FinishedOn).getTime() -
                    new Date(item.StartedOn).getTime()
                )
              );
            });

            dataTemp.forEach((item, index) => {
              item.timeCharging = timeChargingTemp[index];
            });

            setFormData({
              ...formData,
              records: dataTemp,
              footerInfo: tempData,
              timeCharging: timeChargingTemp,
            });
          })
          .catch((err) => {
            notifierMiddleware("warning", err.message);
            return;
          });
        setStep((currStep) => currStep + 1);
        setLoading(false);
      }
    } else if (step === 1) {
    }
  };

  return (
    <>
      <div
        className="bg-navOp-500 rounded-xl my-10 py-5
    grid xl:grid-rows-6 xl:grid-cols-1 gap-5 overflow-scroll"
      >
        {loading && <LoadingSpinner asOverlay />}
        <div className="row-span-5 w-auto h-auto">{StepDisplay()}</div>
        <div
          className={`row-span-1 flex items-end justify-end  ${
            step === 1 ? " final" : ""
          }`}
        >
          <button
            className={`${styles.respFontExtraSmaller} bg-bgBlue-500 shadow-sm-light shadow-secondary py-2 px-10 md:mr-16 xxs:mr-8 rounded-xl text-whitesmoke-500`}
            style={{ display: `${step === 0 ? "none" : "inline-block"}` }}
            onClick={prevStepFunction}
          >
            Prev
          </button>
          <button
            className={`${styles.respFontExtraSmaller} bg-lighterBlue shadow-sm-light shadow-secondary py-2 px-10 mr-5 rounded-xl text-whitesmoke-500`}
            style={{ display: `${step === 1 ? "none" : "inline-block"}` }}
            onClick={getValidation}
          >
            {step === 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
      {/* <div
        className="absolute top-96 left-5 max-h-96 overflow-scroll"
        style={{ color: "whitesmoke" }}
      >
        <pre>{JSON.stringify(tempState, null, 2)}</pre>
      </div> */}
    </>
  );
};

export default Form;
