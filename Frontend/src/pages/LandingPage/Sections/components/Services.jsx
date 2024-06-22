import React from "react";
import Direction from "../../../../assets/img/direction.svg";
import Discount from "../../../../assets/img/Discount.svg";
import DataReport from "../../../../assets/img/data-report.svg";
import Fade from "react-reveal/Fade";
import styles from "../../../../style";

const Services = () => {
  return (
    <div className="flex items-center justify-center w-screen md:h-screen xxs:h-[20%] bg-black md:px-56 xxs:px-5" id="services">
      <div className="w-full h-full flex flex-col items-center justify-center md:gap-50 xxs:gap-0">
        <div className="flex items-center justify-center w-full md:pb-20 md:pt-0 xxs:pt-10 xxs:pb-5">
          <h1
            className={`${styles.respFontExtraLarge} w-fit text-center font-bold text-gradient`}
          >
            Our Services
          </h1>
        </div>
        <div className="flex md:flex-row xxs:flex-col items-center justify-center gap-10">
          <Fade left>
            <div
              className="md:w-[30%] xxs:w-[75%] h-[100%] landing-card-shadow rounded-2xl 
              border-[1px] border-gray-700 p-10 gap-5
              carding hover:border-2 hover:border-dimWhite
             transition-all duration-300 ease-in-out"
            >
              <div className="flex items-center justify-center flex-col">
                <img src={Direction} alt="" width="256px" height="256px" />
                <div className="serv-content">
                  <h2
                    className={`${styles.respFontNormal} text-secondary-gradient w-fit font-semibold`}
                  >
                    Map Support
                  </h2>
                  <p className={`${styles.respFontSmaller} text-white`}>
                    We show all the available charging stations within 15km from
                    your location
                  </p>
                </div>
              </div>
            </div>
          </Fade>
          <Fade bottom>
            <div
              className="md:w-[30%] xxs:w-[75%] h-[100%] landing-card-shadow rounded-2xl 
             border-[1px] border-gray-700 p-10 gap-5
             carding hover:border-2 hover:border-dimWhite
            transition-all duration-300 ease-in-out"
            >
              <div className="flex items-center justify-center flex-col">
                <img src={Discount} alt="" width="256px" height="256px" />
                <div className="serv-content">
                  <h2
                    className={`${styles.respFontNormal} text-secondary-gradient w-fit font-semibold`}
                  >
                    Reduce Expenses
                  </h2>
                  <p className={`${styles.respFontSmaller} text-white`}>
                    Get different discounts according to your charges
                  </p>
                </div>
              </div>
            </div>
          </Fade>
          <Fade right>
            <div
              className="md:w-[30%] xxs:w-[75%] h-[100%] landing-card-shadow rounded-2xl 
             border-[1px] border-gray-700 p-10 gap-5
             carding hover:border-2 hover:border-dimWhite
            transition-all duration-300 ease-in-out md:mb-0 xxs:mb-20"
            >
              <div className="flex items-center justify-center flex-col">
                <img src={DataReport} alt="" width="256px" height="256px" />
                <div className="serv-content">
                  <h2
                    className={`${styles.respFontNormal} text-secondary-gradient w-fit font-semibold`}
                  >
                    Keep track of your activity
                  </h2>
                  <p className={`${styles.respFontSmaller} text-white`}>
                    We help you .. well help you! For every charge you've done
                    you can see it all
                  </p>
                </div>
              </div>
            </div>
          </Fade>
        </div>
      </div>
    </div>
  );
};

export default Services;
