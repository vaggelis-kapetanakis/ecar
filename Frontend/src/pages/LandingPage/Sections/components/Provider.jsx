import React from "react";
import Spline from "@splinetool/react-spline";
import Fade from "react-reveal/Fade";
import styles from "../../../../style";
import Blob2 from "../../../../assets/img/blob2-resp.png";

const Provider = () => {
  return (
    <div
      className="w-screen md:h-screen xxs:h-[50%] bg-black md:pr-56 md:pl-20 xxs:pl-5 xxs:pr-5"
      id="provider"
    >
      <div className="grid md:grid-cols-3 md:grid-rows-1 xxs:grid-cols-1 xxs:grid-rows-3 gap-10">
        <Fade bottom>
          <div className="w-full h-full md:block xxs:hidden md:col-span-2 md:row-span-1 xxs:col-span-1 xxs:row-[2/3]">
            {
              <Spline
                className="scale-75"
                scene="https://prod.spline.design/n-XkAbl3wyYKVkWi/scene.splinecode"
              />
            }
          </div>
          <div className="w-full h-full items-center justify-center md:hidden xxs:flex mt-10">
            <img src={Blob2} className="max-w-sm max-h-sm" alt="providerImgBlob" />
          </div>
        </Fade>
        <Fade bottom>
          <div className="md:h-screen xxs:h-auto md:col-span-1 md:row-span-1 xxs:row-[1/1] flex md:items-start xxs:items-center justify-center flex-col">
            <h1
              className={`${styles.respFontLarge} text-gradient font-bold w-fit md:mb-10 xxs:mb-3`}
            >
              AS AN ENERGY PROVIDER.
            </h1>
            <h2
              className={`${styles.respFontNormal} text-primary-500 font-bold md:mb-10 xxs:mb-3`}
            >
              Maintain your charging stations
            </h2>
            <p
              className={`${styles.respFontSmall} text-white xl:max-w-full md:max-w-[18rem] xxs:max-w-[18rem]`}
            >
              Easily manage your charging stations in any way it suits you best.
              Get the overview you deserve.
            </p>
          </div>
        </Fade>
      </div>
    </div>
  );
};

export default Provider;
