import React from "react";
import { ErrorMessage, useField } from "formik";
import { motion } from "framer-motion";
import styles from "../style";

const TextField = ({ label, duration, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <motion.div
      initial={{ opacity: 0, translateY: "150px" }}
      animate={{
        opacity: 1,
        translateY: 0,
        transition: { ease: "backOut", duration: `${duration}` },
      }}
      className={`flex flex-col items-start justify-start w-full`}
    >
      <input
        placeholder={label}
        className={`${
          styles.respFontSmaller
        } p-5 border-2 w-full h-14 border-bg-dark1 text-white !bg-dark1 rounded-2xl
        outline-none font-normal placeholder:text-gray-600 focus:border-2
        focus:border-loginBorder transition-all duration-300 ease-in-out 
        autofill:!bg-dark1 autofill:focus:!bg-dark1 mb-5 tracking-wider ${
          meta.touched && meta.error && `is-invalid`
        } `}
        autoComplete="on"
        {...field}
        {...props}
      />
      <div
        className={`text-danger-500 font-bold m-5 mt-[-10px] ${styles.respFontSmaller}`}
      >
        <ErrorMessage name={field.name} />
      </div>
    </motion.div>
  );
};

export default TextField;
