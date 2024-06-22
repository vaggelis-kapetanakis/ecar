import React, { useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion } from "framer-motion";
import styles from "../../../../style";
import SessionsDataImg from "../../../../assets/img/sessionsData.svg";
import { AuthContext } from "../../../../shared/context/auth-context";

const SelectSessionsVehicle = ({ formData, setFormData }) => {
  const auth = useContext(AuthContext);

  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return (
    <div className="xl:h-[60vh] xxs:h-[100vh] w-auto p-10 mt-10">
      <div className="flex items-center justify-evenly xl:flex-row xxs:flex-col gap-5">
        <div className="flex flex-col gap-10">
          <motion.div
            initial={{ opacity: 0, translateY: "150px" }}
            animate={{
              opacity: 1,
              translateY: 0,
              transition: { ease: "backOut", duration: `1` },
            }}
            className="flex flex-col"
          >
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
                defaultValue={`${
                  formData.vehicleID === "" ? "" : formData.vehicleID
                }`}
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
                  Select the vehicle you want to see its data
                </option>

                {auth.vehicles.map((vehicle) => (
                  <option value={vehicle.id} key={vehicle._id}>
                    {vehicle.brand} &nbsp; {vehicle.model}
                  </option>
                ))}
              </select>
            )}
            {/* <input
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
            <label
              htmlFor="tips"
              className={`${styles.respFontTiny} text-white`}
            >
              bcd8700d-241c-43a1-b9df-24ee310ea8e4
            </label> */}
          </motion.div>
          <div className="w-fit flex md:flex-col xxs:flex-col gap-3 items-center justify-center">
            <motion.div
              initial={{ opacity: 0, translateY: "150px" }}
              animate={{
                opacity: 1,
                translateY: 0,
                transition: { ease: "backOut", duration: `1.1` },
              }}
              className="z-50"
            >
              <label
                htmlFor="date from"
                className={`${styles.respFontExtraSmall} mb-3 text-whitesmoke-500`}
              >
                Date From
              </label>
              <DatePicker
                className={`${styles.respFontExtraSmaller} md:w-96 xxs:w-48 h-5 md:p-7 xxs:py-6 
                xxs:px-3 border-none rounded-xl outline-none bg-bgBlue-500 text-primary-500 cursor-default`}
                selected={formData.dateFrom}
                onChange={(date) =>
                  setFormData({ ...formData, dateFrom: date })
                }
                value={new Date(formData.dateFrom).toLocaleDateString(
                  "en-US",
                  options
                )}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, translateY: "150px" }}
              animate={{
                opacity: 1,
                translateY: 0,
                transition: { ease: "backOut", duration: `1.2` },
              }}
              className="z-50"
            >
              <label
                htmlFor="date to"
                className={`${styles.respFontExtraSmall} mb-3 text-whitesmoke-500 z-10`}
              >
                Date To
              </label>
              <DatePicker
                className={`${styles.respFontExtraSmaller} md:w-96 xxs:w-48 h-5 md:p-7 xxs:py-6 
                xxs:px-3 border-none rounded-xl outline-none bg-bgBlue-500 text-primary-500 cursor-default`}
                selected={formData.dateTo}
                onChange={(date) => setFormData({ ...formData, dateTo: date })}
                value={new Date(formData.dateTo).toLocaleDateString(
                  "en-US",
                  options
                )}
              />
            </motion.div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: { ease: "backOut", duration: 1.3 },
          }}
          className="xl:w-2 xxs:w-full flex xl:border-r-2 xl:border-b-0 xxs:border-b-2 border-whitesmoke-500 xl:h-[30rem] xxs:h-3"
        >
          {" "}
          &nbsp;
        </motion.div>
        <motion.div
          initial={{ opacity: 0, translateX: "150px" }}
          animate={{
            opacity: 1,
            translateX: 0,
            transition: { ease: "backOut", duration: `1.2` },
          }}
          className="xl:w-96 lg:w-80 md:w-72 sm:w-64 ss:w-56 xxs:w-40"
        >
          <img src={SessionsDataImg} alt="" />
          <h6
            className={`${styles.respFontExtraSmall} antialiased text-whitesmoke-500 whitespace-normal mt-10`}
          >
            We help you manage your vehicle charges. Find them all with the
            click of a button!
          </h6>
        </motion.div>
      </div>
    </div>
  );
};

export default SelectSessionsVehicle;
