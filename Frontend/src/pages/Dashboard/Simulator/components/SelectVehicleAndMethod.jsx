import React, { useContext } from "react";
import { motion } from "framer-motion";
import styles from "../../../../style";
import AddToAcc from "../../../../assets/img/addToAcc.png";
import PayNow from "../../../../assets/img/payNow.png";
import { MdOutlineArrowDownward } from "react-icons/md";
import { AuthContext } from "../../../../shared/context/auth-context";
/* import { useQuery } from "react-query";
import { AuthContext } from "../../../../shared/context/auth-context";
import { useContext } from "react"; */
/* import notifierMiddleware from "../../../../UIElements/Notifier/Notifier";
import axios from "axios";
import LoadingSpinner from "../../../../UIElements/LoadingSpinner/LoadingSpinner"; */

/* const fetchVehicles = (userID) => {
  return axios.get(process.env.REACT_APP_BACKEND_URL + `/cars/user/${userID}`);
};
 */
const SelectVehicleAndMethod = ({ formData, setFormData }) => {
  const auth = useContext(AuthContext);

  const handleImgClick = (imgId) => {
    if (imgId === "addToAcc") {
      setFormData({
        ...formData,
        whenToPay: "addToAcc",
        isImgAccClicked: true,
        isImgNowClicked: false,
      });
    } else {
      setFormData({
        ...formData,
        whenToPay: "payNow",
        isImgAccClicked: false,
        isImgNowClicked: true,
      });
    }
  };

  /* const onSuccess = (data) => {
    data?.data.vehicles.forEach((results) => {
      rows.push({
        id: results._id,
        vehicleId: results.id,
        brand: results.brand,
        type: results.type,
        model: results.model,
        average_consumption: results.average_consumption,
        release_year: results.release_year,
      });
    });
    setVehicles(rows);
  };

  const onError = (error) => {
    notifierMiddleware("warning", error.message);
  };

  const { isLoading, isError, error, data, isFetching } = useQuery(
    "fetch-vehicles",
    () => fetchVehicles(auth.userId),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading || isFetching) {
    return (
      <div>
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  if (isError) {
    return notifierMiddleware("warning", error.message);
  } */

  return (
    <div className="w-auto p-10 mt-10">
      <div className="flex items-center justify-evenly xl:flex-row xxs:flex-col gap-5">
        <div className="flex flex-col items-center justify-center shrink-0 grow xl:h-[30rem] xxs:h-96 xxs:gap-5">
          <motion.div
            initial={{ opacity: 0, translateY: "150px" }}
            animate={{
              opacity: 1,
              translateY: 0,
              transition: { ease: "backOut", duration: `1` },
            }}
            className={`flex flex-col items-center justify-center w-full`}
          >
            <div className="flex flex-col">
              <label
                htmlFor="vehicle id"
                className={`${styles.respFontExtraSmall} mb-3 text-whitesmoke-500`}
              >
                VehicleID
              </label>
              {auth.vehicles === [] ? (
                <input
                  onChange={(event) =>
                    setFormData({ ...formData, vehicleID: event.target.value })
                  }
                  value={formData.vehicleID === "" ? "" : formData.vehicleID}
                  placeholder="VehicleID"
                  className={`${styles.respFontSmaller} xl:w-96 lg:w-80 md:w-72 sm:w-64 ss:w-60 xxs:w-48 p-5 border-2 h-14 border-bg-dark1 text-white bg-bgBlue-500 rounded-2xl
        outline-none font-normal placeholder:text-gray-600 focus:border-2
        focus:border-loginBorder transition-all duration-300 ease-in-out 
        autofill:!bg-dark1 autofill:focus:!bg-dark1 mb-5 tracking-wider `}
                  autoComplete="on"
                />
              ) : (
                <select
                  name="costPerkWh"
                  id=""
                  defaultValue="slctVehcl"
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      vehicleID: event.target.value,
                    })
                  }
                  className={`${styles.respFontExtraSmaller} rounded-lg xl:w-96 lg:w-80 md:w-72 sm:w-64 ss:w-60 xxs:w-48 bg-bgBlue-500
            text-whitesmoke-500 autofill:bg-dark1 col-span-3`}
                >
                  <option value="slctVehcl" disabled>
                    Select the vehicle that we're charging
                  </option>

                  {auth.vehicles.map((vehicle) => (
                    <option value={vehicle._id} key={vehicle._id}>
                      {vehicle.brand} &nbsp; {vehicle.model}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, translateY: "150px" }}
            animate={{
              opacity: 1,
              translateY: 0,
              transition: { ease: "backOut", duration: 1.2 },
            }}
            className={`flex flex-col items-center justify-center w-full`}
          >
            <div className="flex flex-col">
              <label
                htmlFor="vehicle id"
                className={`${styles.respFontExtraSmall} mb-3 text-whitesmoke-500`}
              >
                PointID
              </label>
              <input
                onChange={(event) =>
                  setFormData({ ...formData, pointID: event.target.value })
                }
                value={formData.pointID === "" ? "" : formData.pointID}
                placeholder="PointID"
                className={`${styles.respFontSmaller} xl:w-96 lg:w-80 md:w-72 sm:w-64 ss:w-60 xxs:w-48 p-5 border-2 h-14 border-bg-dark1 text-white bg-bgBlue-500 rounded-2xl
        outline-none font-normal placeholder:text-gray-600 focus:border-2
        focus:border-loginBorder transition-all duration-300 ease-in-out 
        autofill:!bg-dark1 autofill:focus:!bg-dark1 mb-5 tracking-wider `}
                autoComplete="on"
              />
            </div>
            <label
              htmlFor="tips"
              className={`${styles.respFontTiny} text-white`}
            >
              167142
            </label>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, translateY: "150px" }}
            animate={{
              opacity: 1,
              translateY: 0,
              transition: { ease: "backOut", duration: 1.4 },
            }}
            className={`flex flex-col items-center justify-center w-full`}
          >
            <div className="flex flex-col">
              <label
                htmlFor="vehicle id"
                className={`${styles.respFontExtraSmall} mb-3 text-whitesmoke-500`}
              >
                StationID
              </label>
              <input
                onChange={(event) =>
                  setFormData({ ...formData, stationID: event.target.value })
                }
                value={formData.stationID === "" ? "" : formData.stationID}
                placeholder="StationID"
                className={`${styles.respFontSmaller} xl:w-96 lg:w-80 md:w-72 sm:w-64 ss:w-60 xxs:w-48 p-5 border-2 h-14 border-bg-dark1 text-white bg-bgBlue-500 rounded-2xl
        outline-none font-normal placeholder:text-gray-600 focus:border-2
        focus:border-loginBorder transition-all duration-300 ease-in-out 
        autofill:!bg-dark1 autofill:focus:!bg-dark1 mb-5 tracking-wider `}
                autoComplete="on"
              />
            </div>
            <label
              htmlFor="tips"
              className={`${styles.respFontTiny} text-white`}
            >
              2-39-83-387
            </label>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { ease: "backOut", duration: 1.4 },
          }}
          className="xl:w-2 xxs:w-full flex xl:border-r-2 xl:border-b-0 xxs:border-b-2 border-whitesmoke-500 xl:h-[30rem] xxs:h-3"
        >
          {" "}
          &nbsp;
        </motion.div>
        <div className="flex grow xl:h-[30rem] xxs:h-56">
          <div className="h-full w-full flex flex-col justify-between items-center gap-5">
            <div className="flex flex-col items-center justify-center gap-3">
              <span
                className={`${styles.respFontExtraSmaller} text-gray-400 font-bold uppercase flex flex-row gap-3`}
              >
                <MdOutlineArrowDownward />
                Add to Account
                <MdOutlineArrowDownward />
              </span>
              <motion.div
                initial={{ opacity: 0, translateX: "150px" }}
                animate={{
                  opacity: 1,
                  translateX: 0,
                  transition: { ease: "backOut", duration: 1.4 },
                }}
                className={`xl:w-96 lg:w-80 md:w-72 sm:w-64 ss:w-56 xxs:w-48 bg-bgBlue-500 cursor-pointer rounded-xl`}
                onClick={() => handleImgClick("addToAcc")}
              >
                <img
                  src={AddToAcc}
                  alt="add to account"
                  className={`${
                    formData.isImgAccClicked ? "opacity-100" : "opacity-10"
                  } transition-all duration-300 ease-out`}
                />
              </motion.div>
            </div>
            <div className="flex flex-col items-center justify-center gap-3">
              <span
                className={`${styles.respFontExtraSmaller} text-gray-400 font-bold uppercase flex flex-row gap-3`}
              >
                <MdOutlineArrowDownward />
                Pay Now
                <MdOutlineArrowDownward />
              </span>
              <motion.div
                initial={{ opacity: 0, translateX: "150px" }}
                animate={{
                  opacity: 1,
                  translateX: 0,
                  transition: { ease: "backOut", duration: 1.6 },
                }}
                className={`xl:w-96 lg:w-80 md:w-72 sm:w-64 ss:w-56 xxs:w-48 bg-bgBlue-500 cursor-pointer rounded-xl`}
                onClick={() => handleImgClick("payNow")}
              >
                <img
                  src={PayNow}
                  alt="pay now"
                  className={`${
                    formData.isImgNowClicked ? "opacity-100" : "opacity-10"
                  } transition-all duration-300 ease-out`}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectVehicleAndMethod;
