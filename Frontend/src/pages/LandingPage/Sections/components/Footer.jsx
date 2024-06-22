import React from "react";
import styles from "../../../../style";

const Footer = () => {
  return (
    <div
      className="w-screen h-[20vh] flex bg-black
    items-center justify-center border-t-2 border-[#50aaffc7]"
    >
      <div
        className="flex items-center justify-evenly md:flex-row
       xxs:flex-col gap-5 w-[60%]"
      >
        <p className={`${styles.respFontSmaller} text-tertiary-500`}>
          {" "}
          Copyright &copy; 2022-
          {new Date().getFullYear()} Vaggelis Kapetanakis All Rights Reserved
        </p>
        <p className={`${styles.respFontSmaller} text-tertiary-500`}>
          {" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://saas-74.web.app/"
          >
            Q&A App
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
