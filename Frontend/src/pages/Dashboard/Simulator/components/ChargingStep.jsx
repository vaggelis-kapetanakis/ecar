import React, { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../../../shared/context/auth-context";
import notifierMiddleware from "../../../../UIElements/Notifier/Notifier";
import CountUp from "react-countup";
import "./chargingstep.css";
import { motion } from "framer-motion";
import styles from "../../../../style";

const ChargingStep = ({ formData, setFormData }) => {
  const auth = useContext(AuthContext);
  useEffect(() => {
    let deptTemp = 0;
    if (formData.costPerkWh !== 0) {
      if (formData.whenToPay === "addToAcc") {
        try {
          deptTemp =
            parseInt(
              (parseFloat(formData.toPerc) - formData.fromPerc) *
                formData.costPerkWh,
              10
            ) - parseFloat(formData.discount);
        } catch (err) {
          notifierMiddleware("warning", err.message);
        }
      }
    } else {
      deptTemp = 0;
    }

    const pointsAddedTemp = parseInt(
      parseFloat(
        (parseFloat(formData.toPerc) - formData.fromPerc) *
          10 *
          formData.costPerkWh
      )
    );
    setFormData({
      ...formData,
      chargingDept: deptTemp,
      pointsAdded: pointsAddedTemp < 0 ? 0 : pointsAddedTemp,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.toPerc,
    formData.fromPerc,
    formData.costPerkWh,
    formData.discount,
  ]);

  return (
    <div className="flex flex-col gap-10 w-auto md:px-20 xxs:px-3 py-10">
      <div className="grid md:grid-rows-1 md:grid-cols-6 xxs:grid-rows-7 xxs:grid-cols-1 md:gap-10 xxs:gap-y-5 md:mx-10 xxs:mx-2">
        <div className="flex xxs:flex-row xxs:justify-evenly xxs:gap-3 md:col-span-2 xxs:col-span-1">
          <motion.div
            initial={{ opacity: 0, translateY: "150px" }}
            animate={{
              opacity: 1,
              translateY: 0,
              transition: { ease: "backOut", duration: 1 },
            }}
            className={`${styles.respFontExtraSmaller} bg-bgBlue-500 text-whitesmoke-500 col-span-1 flex 
        items-center justify-between rounded-2xl px-5 py-1`}
          >
            From:
            <span className="ml-3 text-tertiary-500">{formData.fromPerc}</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, translateY: "150px" }}
            animate={{
              opacity: 1,
              translateY: 0,
              transition: { ease: "backOut", duration: 1.2 },
            }}
            className={`${styles.respFontExtraSmaller} px-5 py-1 bg-bgBlue-500 text-whitesmoke-500 col-span-1 
        flex items-center justify-between rounded-2xl`}
          >
            To:
            <select
              name="toPerc"
              id=""
              defaultValue={
                formData.toPerc === "" ? "100%" : `${formData.toPerc}`
              }
              onChange={(event) =>
                setFormData({ ...formData, toPerc: event.target.value })
              }
              className={`${styles.respFontExtraSmaller} ml-3 rounded-lg w-fit bg-bgBlue-500
                text-tertiary-500 autofill:bg-dark1`}
            >
              <option value="50%">50%</option>
              <option value="75%">75%</option>
              <option value="100%">100%</option>
            </select>
          </motion.div>
        </div>
        <motion.select
          initial={{ opacity: 0, translateY: "150px" }}
          animate={{
            opacity: 1,
            translateY: 0,
            transition: { ease: "backOut", duration: 1.1 },
          }}
          name="costPerkWh"
          id=""
          defaultValue={
            formData.slctedProvider === ""
              ? "slctProv"
              : `${formData.costPerkWh} + ${formData.slctedProvider}`
          }
          onChange={(event) =>
            setFormData({
              ...formData,
              costPerkWh: event.target.value.split("+")[0].trim(),
              slctedProvider: event.target.value.split("+")[1].trim(),
            })
          }
          className={`${styles.respFontExtraSmaller} rounded-lg w-full bg-bgBlue-500
              text-whitesmoke-500 autofill:bg-dark1 col-span-3`}
        >
          <option value="slctProv" disabled>
            Select a Provider
          </option>

          {formData.providers.map((item) => (
            <option value={`${item.kWhCost} + ${item.Title}`} key={item._id}>
              Cost: {item.kWhCost} || Provider: {item.Title}
            </option>
          ))}
        </motion.select>
        <motion.div
          initial={{ opacity: 0, translateY: "150px" }}
          animate={{
            opacity: 1,
            translateY: 0,
            transition: { ease: "backOut", duration: 1.3 },
          }}
          className={`${styles.respFontExtraSmaller} bg-bgBlue-500 text-whitesmoke-500 col-span-1 flex items-center justify-center rounded-2xl`}
        >
          Cost Per kWh:
          <span className="ml-3 text-tertiary-500">{formData.costPerkWh}</span>
        </motion.div>
      </div>
      {formData.costPerkWh !== 0 && (
        <div className="grid md:grid-rows-1 md:grid-cols-3 xxs:grid-rows-2 xxs:grid-cols-1 md:mx-10 xxs:mx-3 md:gap-16 xxs:gap-y-5">
          <div
            className="flex flex-col items-start justify-center 
          gap-5 md:col-span-2 md:row-span-1 xxs:col-span-1 xxs:row-span-1"
          >
            <motion.select
              initial={{ opacity: 0, translateX: "-150px" }}
              animate={{
                opacity: 1,
                translateX: 0,
                transition: { ease: "backOut", duration: 1.6 },
              }}
              name="discount"
              id=""
              defaultValue={
                formData.slctedProvider === ""
                  ? "slctDisc"
                  : `${formData.discount} + ${formData.pointsUsed}`
              }
              onChange={(event) => {
                setFormData({
                  ...formData,
                  discount: event.target.value.split("+")[0].trim(),
                  pointsUsed: event.target.value.split("+")[1].trim(),
                });
              }}
              className={`${styles.respFontExtraSmaller} rounded-lg md:w-full xxs:w-56 bg-bgBlue-500
                    text-whitesmoke-500 autofill:bg-dark1 col-span-3`}
            >
              <option value="slctDisc" disabled>
                Select a Discount (Optional)
              </option>
              {formData.discountOptions.map((item) => (
                <option
                  value={`${item.disc} + ${item.pointsUsed}`}
                  key={item.id}
                >
                  {item.text} || You're saving: {item.disc} € || Points used:{" "}
                  {item.pointsUsed}
                </option>
              ))}
            </motion.select>
            <motion.div
              initial={{ opacity: 0, translateX: "-150px" }}
              animate={{
                opacity: 1,
                translateX: 0,
                transition: { ease: "backOut", duration: 1.5 },
              }}
              className={`${styles.respFontExtraSmaller} bg-bgBlue-500 text-whitesmoke-500 col-span-1 flex 
        items-center justify-between rounded-2xl px-5 py-2 w-56`}
            >
              Your Points:
              <span className={`${styles.respFontExtraSmaller} ml-3 text-tertiary-500`}>{(auth.points === undefined ? 0 : auth.points)}</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, translateX: "-150px" }}
              animate={{
                opacity: 1,
                translateX: 0,
                transition: { ease: "backOut", duration: 1.4 },
              }}
              className={`${styles.respFontExtraSmaller} bg-bgBlue-500 text-whitesmoke-500 col-span-1 flex 
        items-center justify-between rounded-2xl px-5 py-2 w-56`}
            >
              Points Used:
              <span className={`${styles.respFontExtraSmaller} ml-3 text-danger-500`}>{formData.pointsUsed}</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, translateX: "-150px" }}
              animate={{
                opacity: 1,
                translateX: 0,
                transition: { ease: "backOut", duration: 1.3 },
              }}
              className={`${styles.respFontExtraSmaller} bg-bgBlue-500 text-whitesmoke-500 col-span-1 flex 
        items-center justify-between rounded-2xl px-5 py-2 w-56`}
            >
              Points Added:
              <span className={`${styles.respFontExtraSmaller} ml-3 text-success-500 antialiased`}>
                {formData.pointsAdded}
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, translateX: "-150px" }}
              animate={{
                opacity: 1,
                translateX: 0,
                transition: { ease: "backOut", duration: 1.2 },
              }}
              className={`${styles.respFontExtraSmaller} bg-bgBlue-500 text-whitesmoke-500 col-span-1 flex 
        items-center justify-between rounded-2xl px-5 py-2 w-56`}
            >
              Final Points:
              <span className={`${styles.respFontExtraSmaller} ml-3 text-tertiary-500 antialiased`}>
                {parseInt(
                  (auth.points === undefined ? 0 : auth.points) + formData.pointsAdded - formData.pointsUsed
                )}
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, translateX: "-150px" }}
              animate={{
                opacity: 1,
                translateX: 0,
                transition: { ease: "backOut", duration: 1.1 },
              }}
              className={`${styles.respFontExtraSmaller} bg-bgBlue-500 text-whitesmoke-500 col-span-1 flex 
        items-center justify-between rounded-2xl px-5 py-2 w-56`}
            >
              Discount:
              <span className={`${styles.respFontExtraSmaller} ml-3 text-tertiary-500`}>
                {formData.discount} {" €"}
              </span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, translateX: "-150px" }}
              animate={{
                opacity: 1,
                translateX: 0,
                transition: { ease: "backOut", duration: 1 },
              }}
              className={`${styles.respFontExtraSmaller} bg-bgBlue-500 text-whitesmoke-500 col-span-1 flex 
        items-center justify-between md:rounded-2xl xxs:rounded-md px-5 py-2 md:w-96 xxs:w-56 border-2 
        border-danger-500-500`}
            >
              Expected Cost:
              <span className="ml-3 text-danger-500">
                <CountUp
                  start={0}
                  end={
                    parseInt(
                      (parseFloat(formData.toPerc) - formData.fromPerc) *
                        formData.costPerkWh,
                      10
                    ) -
                      parseFloat(formData.discount) >
                    0
                      ? parseInt(
                          (parseFloat(formData.toPerc) - formData.fromPerc) *
                            formData.costPerkWh,
                          10
                        ) - parseFloat(formData.discount)
                      : 0
                  }
                  duration={5}
                  useEasing={true}
                  decimals={2}
                  suffix=" €"
                  useGrouping={true}
                  redraw="true"
                />
              </span>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, translateX: "150px", scale: 0.3 }}
            animate={{
              opacity: 1,
              translateX: 0,
              scale: 1,
              transition: { ease: "backOut", duration: 1 },
            }}
            className="counting-up-charging-container col-span-1"
          >
            <div className="flex items-center justify-center">
              <div className="g-contrast">
                <div className="g-circle">
                  <span className="antialiased absolute top-14 left-20 z-50 text-whitesmoke-500">
                    <CountUp
                      start={formData.fromPerc}
                      end={parseFloat(formData.toPerc)}
                      duration={5}
                      decimals={2}
                      useEasing={true}
                      suffix=" %"
                      redraw="true"
                    />
                  </span>
                </div>
                <ul className="g-bubbles">
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                  <li></li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ChargingStep;
