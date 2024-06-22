import React, { useState } from "react";
import { MdCheck } from "react-icons/md";
import notifierMiddleware from "../../../../UIElements/Notifier/Notifier";
import LoadingSpinner from "../../../../UIElements/LoadingSpinner/LoadingSpinner";
import { AuthContext } from "../../../../shared/context/auth-context";
import axios from "axios";
import uniq from "../../../../shared/utils/rmv-duplicates";
import { useNavigate } from "react-router-dom";
import ChargingStep from "./ChargingStep";
import Payment from "./Payment";
import SelectVehicleAndMethod from "./SelectVehicleAndMethod";
import "./progressBar.css";
import styles from "../../../../style";
import { compareVehicleFn } from "./Functions/CompareVehicleFn";

const getRandomInt = () => {
  var rand = Math.random() * (50 - 30) + 30;
  var power = Math.pow(10, 0);
  return Math.floor(rand * power) / power;
};

const FormTitles = [
  "Select Vehicle and Payment Method",
  "Charging...",
  "Payment",
];

const Form = React.memo(() => {
  const [step, setStep] = useState(0);
  const auth = React.useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    vehicleID: "",
    pointID: "",
    stationID: "",
    whenToPay: "",
    providers: [],
    costPerkWh: 0,
    fromPerc: getRandomInt(),
    toPerc: "100%",
    discountOptions: [
      { text: "No Discount", disc: "0%", id: 0, pointsUsed: "0" },
    ],
    pointsUsed: "0",
    pointsAdded: 0,
    pointsFn: auth.points === undefined ? 0 : auth.points,
    discount: "0%",
    chargingDept: 0,
    deptFn: auth.debt === undefined ? 0 : auth.debt,
    lastCharge: new Date().toISOString(),
    number: "",
    name: "",
    expiry: "",
    cvc: "",
    issuer: "",
    focused: "",
    formCardData: null,
    isImgAccClicked: false,
    isImgNowClicked: false,
    slctedProvider: "",
  });

  const tempState = { ...formData };
  delete tempState.providers;

  const StepDisplay = () => {
    if (step === 0) {
      return (
        <SelectVehicleAndMethod formData={formData} setFormData={setFormData} />
      );
    } else if (step === 1) {
      return <ChargingStep formData={formData} setFormData={setFormData} />;
    } else {
      return <Payment formData={formData} setFormData={setFormData} />;
    }
  };

  const prevStepFunction = () => {
    if (step === 0) {
      setStep((currStep) => currStep - 1);
    } else if (step === 1) {
      /* setFormData({ ...formData, costPerkWh: 0 }); */
      setStep((currStep) => currStep - 1);
    } else {
      setFormData({
        ...formData,
        /* costPerkWh: 0, */
        pointsFn: auth.points === undefined ? 0 : auth.points,
        deptFn: auth.debt === undefined ? 0 : auth.debt,
      });
      setStep((currStep) => currStep - 1);
    }
  };

  const getValidation = async () => {
    if (step === 0) {
      if (formData.vehicleID === "") {
        notifierMiddleware("info", "You must provide your vehicle ID");
      } else if (formData.stationID === "") {
        notifierMiddleware("info", "You must provide a station ID");
      } else if (formData.pointID === "") {
        notifierMiddleware("info", "You must provide a point ID");
      } else if (formData.whenToPay === "") {
        notifierMiddleware("info", "You must provide a payment method");
      } else {
        setLoading(true);
        const responseData = await compareVehicleFn(
          auth.userId,
          formData.vehicleID,
          formData.stationID,
          formData.pointID
        );
        if (!responseData) {
          notifierMiddleware(
            "warning",
            "Invalid field inputs. Note: You can find the vehicle Object ID in the vehicle Overview"
          );
          setLoading(false);
          return;
        }
        const responseProvData = await axios.get(
          process.env.REACT_APP_BACKEND_URL +
            `/providers/${formData.stationID}/${formData.pointID}`,
          { headers: { "X-OBSERVATORY-AUTH": `Bearer ${auth.token}` } }
        );

        let discOptionsTemp = formData.discountOptions;
        if (auth.points === undefined) {
          discOptionsTemp.push({
            text:
              `Newbie Discount: ${0.25 * 100}%` +
              " => " +
              (Math.round(1000 * 0.25 * 0.02 * 100) / 100).toFixed(1) +
              " €",
            disc: (Math.round(1000 * 0.25 * 0.02 * 100) / 100).toFixed(1),
            id: 0.25 + 1,
            pointsUsed: 0,
          });
        } else {
          for (var j = 0.25; j <= 1; j = j + 0.25) {
            discOptionsTemp.push({
              text:
                `Discount: ${j * 100}%` +
                " => " +
                (Math.round(auth.points * j * 0.02 * 100) / 100).toFixed(1) +
                " €",
              disc: (Math.round(auth.points * j * 0.02 * 100) / 100).toFixed(1),
              id: j + 1,
              pointsUsed: (Math.round(auth.points * j * 100) / 100).toFixed(0),
            });
          }
        }
        discOptionsTemp = uniq(discOptionsTemp);
        setFormData({
          ...formData,
          providers: responseProvData.data.providers,
          discountOptions: discOptionsTemp,
        });
        setLoading(false);
        setStep((currStep) => currStep + 1);
      }
    } else if (step === 1) {
      if (formData.costPerkWh === 0) {
        notifierMiddleware("info", "You need to charge your car buddy!");
      } else {
        setLoading(true);
        const deptFnTemp = formData.chargingDept + formData.deptFn;
        const pointsFnTemp =
          formData.pointsFn + formData.pointsAdded - formData.pointsUsed;
        setFormData({
          ...formData,
          pointsFn: pointsFnTemp,
          deptFn: deptFnTemp,
        });
        setStep((currStep) => currStep + 1);
        setLoading(false);
      }
    } else {
      if (
        formData.number === "" ||
        formData.cvc === "" ||
        formData.name === "" ||
        formData.expiry === ""
      ) {
        notifierMiddleware("info", "Please fill your card credentials");
        return;
      } else {
        setLoading(true);
        try {
          await axios
            .get(
              process.env.REACT_APP_BACKEND_URL +
                `/availability/${auth.userId}`,
              { headers: { "X-OBSERVATORY-AUTH": `Bearer ${auth.token}` } }
            )
            .then(async (res) => {
              if (res.data.availability) {
                try {
                  await axios
                    .patch(
                      process.env.REACT_APP_BACKEND_URL +
                        `/charge/${auth.userId}`,
                      {
                        debt: formData.deptFn,
                        from: formData.fromPerc,
                        to: formData.toPerc,
                        points: formData.pointsFn,
                        lastCharge: formData.lastCharge,
                        paymentMethod: formData.whenToPay,
                        vehicleObjID: formData.vehicleID,
                      },
                      {
                        headers: {
                          "X-OBSERVATORY-AUTH": `Bearer ${auth.token}`,
                        },
                      }
                    )
                    .then(
                      notifierMiddleware("success", "Submitted Successfully"),
                      auth.login(
                        auth.userId,
                        auth.token,
                        auth.username,
                        formData.pointsFn,
                        formData.deptFn,
                        formData.lastCharge,
                        auth.chargesDate,
                        auth.type
                      ),

                      /* CHECK THIS OUT IF NAVIGATE DOESNT WORK

                    https://stackoverflow.com/questions/70848130/how-to-redirect-to-another-page-with-passing-data-after-submitting-form-in-using */

                      navigate("/signedin/dashboard")
                    )
                    .catch((err) => {
                      notifierMiddleware("warning", err.message);
                    });
                } catch (err) {
                  notifierMiddleware("warning", err.message);
                }
              } else {
                notifierMiddleware(
                  "warning",
                  "You exceeded your account limit of 100 euros. Either pay what you owe or choose pay now"
                );
              }
            });
        } catch (err) {
          notifierMiddleware("warning", err.message);
        }

        setLoading(false);
      }
    }
  };

  return (
    <div
      className="xl:h-[80vh] xxs:h-[100vh] bg-navOp-500 rounded-xl my-10 py-5
    grid xl:grid-rows-9 xl:grid-cols-1 gap-5 overflow-scroll"
    >
      {loading && <LoadingSpinner asOverlay />}
      <nav className="progress-bar row-span-3">
        <ol className="progress-bar-list">
          <li className="progress-step">
            <div
              className="progress-step-link"
              title={FormTitles[step]}
              tabIndex="0"
              aria-current="step"
            >
              <span className="step-indicator" aria-hidden="true">
                <span className={`step-indicator-text ${styles.respFontExtraSmaller}`}>
                  {step === 0 ? "1" : <MdCheck />}
                </span>
              </span>
              <span className="step-label">
                <span className={`step-text ${styles.respFontTiny}`}>
                  Select Vehicle and Payment Method
                </span>
              </span>
            </div>
          </li>
          {/* <li className="progress-step">
            <div
              className="progress-step-link"
              title={FormTitles[step]}
              tabIndex="0"
              aria-current="step"
            >
              <span className="step-indicator" aria-hidden="true">
                <span className="step-indicator-text">
                  {step !== 2 ? "2" : <MdCheck />}
                </span>
              </span>
              <span className="step-label">
                <span className={`step-text ${styles.respFontExtraSmall}`}>Payment Method</span>
              </span>
            </div>
          </li> */}
          <li className="progress-step">
            <div
              className="progress-step-link"
              title={FormTitles[step]}
              tabIndex="0"
              aria-current="step"
            >
              <span className="step-indicator" aria-hidden="true">
                <span className={`step-indicator-text ${styles.respFontExtraSmaller}`}>
                  {step <= 1 ? "2" : <MdCheck />}
                </span>
              </span>
              <span className="step-label">
                <span className={`step-text ${styles.respFontTiny}`}>Charging</span>
              </span>
            </div>
          </li>
          <li className="progress-step">
            <div
              className="progress-step-link"
              title={FormTitles[step]}
              tabIndex="0"
              aria-current="step"
            >
              <span className="step-indicator" aria-hidden="true">
                <span className={`step-indicator-text ${styles.respFontExtraSmaller}`}>
                  {step <= 2 ? "3" : <MdCheck />}
                </span>
              </span>
              <span className="step-label">
                <span className={`step-text ${styles.respFontTiny}`}>Payment</span>
              </span>
            </div>
          </li>
        </ol>
        <div
          className="progress-bar-widget"
          tabIndex="-1"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="3"
          style={{ gridColumn: "2 / 8" }}
          dir="1tr"
        >
          <span
            className="progress-status-wrap"
            style={{
              background: "#0779e4",
              width: `${step * 50}%`,
            }}
          ></span>
          <div className="progress-selected">
            <span
              className="progress-status-wrap"
              style={{ height: "100%", width: "1e+06" }}
            ></span>
          </div>
        </div>
      </nav>
      <div className="row-span-5 w-auto h-auto">{StepDisplay()}</div>
      <div className="row-span-1 flex items-end justify-end">
        <button
          className={`${styles.respFontExtraSmaller} bg-bgBlue-500 shadow-sm-light shadow-secondary py-2 px-10 md:mr-16 xxs:mr-8 rounded-xl text-whitesmoke-500`}
          disabled={step === 0}
          onClick={prevStepFunction}
        >
          Prev
        </button>
        <button
          className={`${styles.respFontExtraSmaller} bg-lighterBlue shadow-sm-light shadow-secondary py-2 px-10 mr-5 rounded-xl text-whitesmoke-500`}
          onClick={getValidation}
        >
          {step === 2 ? "Finish" : "Next"}
        </button>
      </div>
      {/* {console.log(step)} */}
      {/* <div
        className="absolute top-96 left-5 max-h-96 overflow-scroll"
        style={{ color: "whitesmoke" }}
      >
        <pre>{JSON.stringify(tempState, null, 2)}</pre>
      </div> */}
    </div>
  );
});

export default Form;
