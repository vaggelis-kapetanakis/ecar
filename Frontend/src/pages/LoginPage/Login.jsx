import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import styles from "../../style";
import BgImg from "../../assets/img/login-bg.png";
import { motion } from "framer-motion";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextField from "../../UIElements/TextField";
import notifierMiddleware from "../../UIElements/Notifier/Notifier";
import LoadingSpinner from "../../UIElements/LoadingSpinner/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Login = () => {
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const { sendRequest } = useHttpClient();

  const validate = Yup.object({
    username: Yup.string()
      .max(15, "Must be 15 characters max")
      .required("Required"),
    password: Yup.string()
      .min(8, "Must be at least 8 characters")
      .max(30, "Must be 30 characters max")
      .matches(/(?=.*[0-9])/, "Password must contain a number.")
      .required("Required"),
  });
  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
      }}
      validationSchema={validate}
      onSubmit={async (values) => {
        setLoading(true);
        try {
          await sendRequest(
            process.env.REACT_APP_BACKEND_URL + "/login",
            "PATCH",
            JSON.stringify({
              username: values.username,
              password: values.password,
            }),
            {
              "Content-Type": "application/json",
              "X-Content-Type-Options": "nosniff",
            }
          )
            .then((responseData) => {
              auth.login(
                responseData.userId,
                responseData.token,
                responseData.username,
                responseData.points,
                responseData.debt,
                responseData.lastCharge,
                responseData.chargesDate,
                responseData.type,
                responseData.userWithVehicles.vehicles
              );
              setLoading(false);
            })
            .catch((err) => {
              setLoading(false);
              notifierMiddleware("warning", err.message);
            });
        } catch (err) {
          notifierMiddleware("warning", err.message);
        }
      }}
    >
      {(formik) => (
        <div
          className="w-screen h-screen overflow-hidden bg-[#272A37]
        xxs:flex xxs:items-center xxs:justify-start xxs:flex-col lg:items-baseline
        lg:justify-start"
        >
          {loading ? <LoadingSpinner asOverlay /> : ""}
          <div className="w-fit z-20 lg:absolute xxs:relative lg:p-20 xxs:p-0 xxs:mt-20">
            <NavLink to="/">
              <h1
                className={`${styles.respFontNormal} text-white 
            font-bold flex flex-1 justify-between items-center gap-5`}
              >
                <BsArrowLeft /> Go Back{" "}
              </h1>
            </NavLink>
          </div>
          <div
            className="ss:p-20 lg:absolute xxs:relative z-20 lg:top-56 xxs:top-24 xl:w-[30%]
          lg:w-[40%] sm:w-[50%] xxs:w-[75%] lg:border-0 xxs:border-2 border-dimWhite rounded-xl
          xxs:p-10"
          >
            <motion.div
              initial={{ opacity: 0, translateY: "150px" }}
              animate={{
                opacity: 1,
                translateY: 0,
                transition: { ease: "backOut", duration: 1 },
              }}
              className={`${styles.respFontLarge} md:mb-10
              xxs:mb-5
               font-bold text-white text-center`}
            >
              Login
            </motion.div>
            <Form>
              <TextField
                label="Username"
                name="username"
                type="text"
                duration="1.2"
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                duration="1.4"
              />
              <div
                className="flex md:flex-1 md:flex-row items-center justify-between
              xxs:flex-col xxs:gap-5 md:mt-10 xxs:mt-0"
              >
                <NavLink
                  to="/signup"
                  className="bg-dark1 rounded-2xl py-1 px-12"
                >
                  <h3
                    className={`${styles.respFontSmaller} font-bold text-white`}
                  >
                    Sign Up
                  </h3>
                </NavLink>
                <button
                  to="/signedin/dashboard"
                  className="bg-primary-500 rounded-2xl py-1 px-12"
                  type="submit"
                >
                  <h3
                    className={`${styles.respFontSmaller} font-bold text-white`}
                  >
                    Login
                  </h3>
                </button>
              </div>
            </Form>
          </div>
          <img
            src={BgImg}
            alt="background login img"
            className="w-screen lg:block xxs:hidden"
          />
        </div>
      )}
    </Formik>
  );
};

export default Login;
