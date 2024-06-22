import React from "react";
import Spline from "@splinetool/react-spline";
import Fade from "react-reveal/Fade";
import styles from "../../../../style";
import Blob1 from "../../../../assets/img/blob1-resp.png";

const Individual = () => {
  return (
    <div
      className="w-screen md:h-screen xxs:h-[50%] bg-black md:pl-56 md:pr-20 xxs:pl-5 xxs:pr-5"
      id="individual"
    >
      <div className="grid md:grid-cols-3 md:grid-rows-1 xxs:grid-cols-1 xxs:grid-rows-3 gap-10">
        <Fade bottom>
          <div className="md:h-screen md:col-span-1 xxs:row-span-1 flex md:items-start xxs:items-center justify-center flex-col">
            <h1
              className={`${styles.respFontLarge} text-gradient font-bold w-fit md:mb-10 xxs:mb-3`}
            >
              AS AN INDIVIDUAL.
            </h1>
            <h2
              className={`${styles.respFontNormal} text-primary-500 font-bold md:mb-10 xxs:mb-3`}
            >
              Track your Energy Balance
            </h2>
            <p
              className={`${styles.respFontSmall} text-white md:max-w-[18rem] xxs:max-w-[18rem]`}
            >
              Keep account of your vehicle`s energy consumption and monitor your
              pay dues.
            </p>
          </div>
        </Fade>
        <Fade bottom>
          <div className="flex items-center justify-center w-full h-full md:block xxs:hidden md:col-span-2 xxs:row-span-2">
            {
              <Spline
                className="scale-75"
                scene="https://prod.spline.design/XbwDWp1KOTotANnn/scene.splinecode"
              />
            }
          </div>
          <div className="w-full h-full items-center justify-center md:hidden xxs:flex mt-10">
            <img
              src={Blob1}
              className="max-w-sm max-h-sm"
              alt="individualImgBlob"
            />
          </div>
        </Fade>
      </div>
    </div>
  );
};

export default Individual;
