import React from "react";
import styles from "../../../style";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section id="home" className={`relative w-[100vw] h-[100vh] top-0 left-0 hero-bg`}>
      <motion.div
        initial={{ opacity: 0, translateY: "850px" }}
        animate={{
          opacity: 1,
          translateY: 0,
          transition: { ease: "backOut", duration: 6 },
        }}
        className="w-full h-full"
      >
        <div className="relative top-[25%] left-[15%] max-w-[770px]z-30">
          <h1
            className="flex font-poppins font-semibold lg:text-[72px] md:text-[56px]
           sm:text-[48px] ss:text-[42px] xs:text-[36px] text-[52px]
            text-gradient ss:leading-[100px] leading-[75px]"
          >
            Electric Revolution
          </h1>
          <p
            className={`${styles.paragraph} max-w-[470px] ss:max-w-[320px] xs:max-w-[260px] xxs:max-w-[180px] mt-5`}
          >
            Join us now to take your electric vehicle to the next level.
          </p>
        </div>
        {/* <video
          className="w-full h-full z-[-1] object-cover"
          autoPlay
          muted
          src={BgVideo}
          preload="auto"
          poster={BgImage}
        ></video> */}
      </motion.div>

      {/* <div className={`xl:px-0 sm:px-16 px-6 z-10`}>
        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="flex-1 font-poppins font-semibold ss:text-[72px] text-[52px] text-gradient ss:leading-[100px] leading-[75px]">
            Electric Revolution
          </h1>
        </div>

        <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
          Join us now to take your electric vehicle to the next level.
        </p>
        
      </div> */}
    </section>
  );
};

export default Hero;
