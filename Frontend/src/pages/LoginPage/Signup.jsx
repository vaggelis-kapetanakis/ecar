import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import styles from "../../style";
import BgImg from "../../assets/img/signup-bg.png";
import { motion } from "framer-motion";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextField from "../../UIElements/TextField";
import notifierMiddleware from "../../UIElements/Notifier/Notifier";
import LoadingSpinner from "../../UIElements/LoadingSpinner/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Signup = () => {
  const auth = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const { sendRequest } = useHttpClient();

  const validate = Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .max(15, "Must be 15 characters max")
      .required("Required"),
    email: Yup.string().email("Email is invalid").required("Required"),
    password: Yup.string()
      .min(8, "Must be at least 8 characters")
      .max(30, "Must be 30 characters max")
      .matches(/(?=.*[0-9])/, "Password must contain a number.")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Your Password"),
    type: Yup.string().oneOf(["Owner", "Provider", "owner", "provider"]),
  });
  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        type: "owner",
      }}
      validationSchema={validate}
      onSubmit={async (values) => {
        setLoading(true);
        try {
          const responseData = await sendRequest(
            process.env.REACT_APP_BACKEND_URL + "/signup",
            "POST",
            JSON.stringify({
              username: values.username,
              email: values.email,
              password: values.password,
              type: values.type,
            }),
            {
              "Content-Type": "application/json",
              "X-Content-Type-Options": "nosniff",
            }
          );
          auth.login(
            responseData.userId,
            responseData.token,
            responseData.username,
            (responseData.points = 0),
            (responseData.debt = 0),
            (responseData.lastCharge = "null"),
            (responseData.chargesDate = []),
            responseData.type,
            (responseData.userWithVehicles.vehicles = [])
          );
          setLoading(false);
        } catch (err) {
          setLoading(false);
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
          <div className="w-fit z-20 lg:absolute xxs:relative lg:py-5 lg:px-20 xxs:p-0 xxs:mt-16 xxs:mb-5 lg:right-0 xxs:right-auto">
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
            className="ss:p-20 lg:right-0 xxs:right-auto lg:absolute xxs:relative z-20 lg:top-28 xxs:top-18 xl:w-[30%]
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
              className={`${styles.respFontLarge} mb-10
               font-bold text-white text-center`}
            >
              Sign Up
            </motion.div>
            <Form>
              <TextField
                label="Username"
                name="username"
                type="text"
                duration="1.2"
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                duration="1.4"
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                duration="1.6"
              />
              <TextField
                label="ConfirmPassword"
                name="confirmPassword"
                type="password"
                duration="1.8"
              />
              {/* <Field
                className={`${styles.respFontSmaller}!bg-dark1 cursor-pointer flex flex-col 
              items-center content-center border-2 border-dark1 rounded-2xl w-full text-white
              focus:border-2 focus:border-loginBorder transition-all duration-300 
              ease-in-out autofill:!bg-dark1 autofill:focus:!bg-dark1`}
                as="select"
                name="type"
              >
                <option className="option-signup" value="owner">
                  Owner
                </option>
                <option value="provider">Provider</option>
              </Field> */}
              <select
                className="rounded-lg w-full bg-dark1
              text-white autofill:bg-dark1"
                as="select"
                name="type"
              >
                <option>Owner</option>
                <option>Provider</option>
              </select>
              {/* <Select
                id="type"
                required={true}
                className="!bg-dark1
               autofill:!bg-dark1"
              >
                <option>Owner</option>
                <option>Provider</option>
              </Select> */}
              <div
                className="flex md:flex-1 md:flex-row items-center justify-between
              xxs:flex-col xxs:gap-5 md:mt-10 xxs:mt-5"
              >
                <button
                  to="/signedin/dashboard"
                  className="bg-primary-500 rounded-2xl py-1 px-12 lg:w-auto xxs:w-full"
                  type="submit"
                >
                  <h3
                    className={`${styles.respFontSmaller} font-bold text-white`}
                  >
                    Sign Up
                  </h3>
                </button>
                <NavLink
                  to="/login"
                  className="bg-dark1 rounded-2xl py-1 px-12 lg:w-auto xxs:w-full
                  flex items-center justify-center"
                >
                  <h3
                    className={`${styles.respFontSmaller} font-bold text-white`}
                  >
                    Login
                  </h3>
                </NavLink>
              </div>
            </Form>
          </div>
          <img
            src={BgImg}
            alt="background signup img"
            className="w-screen lg:block xxs:hidden"
          />
        </div>
      )}
    </Formik>
  );
};

export default Signup;
