import React, { useState } from "react";
import { ResponsiveChoropleth } from "@nivo/geo";
import { GeoFeatures } from "../GeoFeatures/GeoFeatures";
import { geoData as data } from "../../../../constants/data/energy-consumption-2020";
import styles from "../../../../style";
import { motion } from "framer-motion";

const MoreDataForm = ({ title, dataToShow, prefix }) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <h4 className={`${styles.respFontExtraSmaller} text-whitesmoke-300`}>
        {title}:
      </h4>
      <h4
        className={`${styles.respFontExtraSmaller} text-rose-600 font-bold antialiased`}
      >
        {dataToShow === undefined ? (
          "No data"
        ) : (
          <>
            {dataToShow} {` ${prefix}`}
          </>
        )}
      </h4>
    </div>
  );
};

const Choropleth = () => {
  const [countryData, setCountryData] = useState("");

  const retrieveMoreData = (key) => {
    const filtered = data.filter((country) => country.id === key);
    return filtered;
  };

  const getWindowProportions = () => {
    let windowWidth = window.innerWidth;
    let fn;
    if (windowWidth > 1700) {
      fn = 180;
      return fn;
    } else if (windowWidth > 1200) {
      fn = 150;
      return fn;
    } else if (windowWidth > 1060) {
      fn = 120;
      return fn;
    } else if (windowWidth > 768) {
      fn = 90;
      return fn;
    } else if (windowWidth > 620) {
      fn = 60;
      return fn;
    } else if (windowWidth > 480) {
      fn = 60;
      return fn;
    } else if (windowWidth > 360) {
      fn = 50;
      return fn;
    }
    /* return fn */
  };

  return (
    <div
      className="w-[calc(100vw - 10vw)] h-[80vh] bg-navOp-500 rounded-2xl lg:px-10 
    xxs:px-3 py-5 card-shadow flex lg:flex-row xxs:flex-col lg:gap-5 xxs:justify-between"
    >
      <motion.div
        initial={{ opacity: 0, translateX: "-150px", scale: 0.4 }}
        animate={{
          opacity: 1,
          translateX: 0,
          scale: 1,
          transition: { ease: "backOut", duration: 1.5 },
        }}
        className="w-full lg:h-[70vh] md:h-[50vh] xxs:h-[40vh]"
      >
        <div className="w-full lg:mb-10 xxs:mb-3">
          <h1 className={`${styles.respFontSmall} text-primary-600`}>
            Energy Consumption by Country 2020{" "}
            <span className={`${styles.respFontTiny} text-whitesmoke-500`}>
              Data source:{" "}
              <a
                href="https://worldpopulationreview.com/country-rankings/energy-consumption-by-country"
                target="_blank"
                rel="noreferrer"
              >
                World Population On Review
              </a>
            </span>
          </h1>
        </div>
        <ResponsiveChoropleth
          data={data}
          features={GeoFeatures.features}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          colors={[
            "#9cc9f4",
            "#6aafef",
            "#3994e9",
            "#0779e4",
            "#0661b6",
            "#044989",
            "#03305b",
            "#01182e",
          ]}
          isInteractive={true}
          domain={[0, 200]}
          unknownColor="#50aaff"
          label="properties.name"
          valueFormat=".2s"
          projectionScale={getWindowProportions()}
          projectionTranslation={[0.5, 0.5]}
          projectionRotation={[0, 0, 0]}
          enableGraticule={true}
          graticuleLineColor="rgba(245,245,245,0.3)"
          borderWidth={0.5}
          borderColor="#152538"
          graticuleLineWidth={0.5}
          legends={
            window.innerWidth > 1700
              ? [
                  {
                    anchor: "bottom-left",
                    direction: "column",
                    justify: true,
                    translateX: 20,
                    translateY: -100,
                    itemsSpacing: 0,
                    itemWidth: 94,
                    itemHeight: 18,
                    itemDirection: "left-to-right",
                    itemTextColor: "rgba(245,245,245,0.8)",
                    itemOpacity: 0.85,
                    symbolSize: 18,
                    effects: [
                      {
                        on: "hover",
                        style: {
                          itemTextColor: "#0779e4",
                          itemOpacity: 1,
                        },
                      },
                    ],
                  },
                ]
              : []
          }
        />
      </motion.div>
      <div className="lg:w-[20vw] xxs:w-full lg:h-full xxs:h-[20vh] bg-bgBlueLight-600 rounded-2xl p-3 overflow-auto">
        <select
          name="energy consumption"
          defaultValue="slctCountry"
          onChange={(event) => setCountryData(event.target.value)}
          className={`${styles.respFontExtraSmaller} rounded-lg xl:w-72 lg:w-48 md:w-64 sm:w-64 ss:w-60 xxs:w-60 bg-bgBlue-500
            text-whitesmoke-500 autofill:bg-dark1 col-span-3`}
        >
          <option value="slctCountry" disabled>
            Select a Country for more info
          </option>
          {data.map((country) => {
            return (
              <option value={country.id} key={country.id}>
                {country?.country}
              </option>
            );
          })}
        </select>
        <motion.div
          initial={{ opacity: 0, translateX: "-150px" }}
          animate={{
            opacity: 1,
            translateX: 0,
            transition: { ease: "backOut", duration: 1.5 },
          }}
          className="mt-5"
        >
          {countryData === ""
            ? ""
            : retrieveMoreData(countryData).map((moreData, index) => (
                <motion.div
                  initial={{ opacity: 0, translateX: "-150px" }}
                  animate={{
                    opacity: 1,
                    translateX: 0,
                    transition: { ease: "backOut", duration: 1.5 },
                  }}
                  className="flex flex-col gap-y-3"
                  key={index}
                >
                  <div className="flex flex-row items-center justify-between">
                    <h3 className={`${styles.respFontExtraSmall} text-sky-600`}>
                      {moreData.country}
                    </h3>
                    <h3 className={`${styles.respFontExtraSmall} text-sky-600`}>
                      Consumption Rates
                    </h3>
                  </div>

                  <MoreDataForm
                    title="Alpha‑3 code"
                    dataToShow={moreData.id}
                    prefix=""
                  />
                  <MoreDataForm
                    title="Total Energy Consumption"
                    dataToShow={moreData.value}
                    prefix="billion kWh"
                  />
                  <MoreDataForm
                    title="Total per Capita"
                    dataToShow={moreData.totalPerCap}
                    prefix="kWh"
                  />
                  <MoreDataForm
                    title="Year of Data"
                    dataToShow={moreData.perCapDatayear}
                    prefix=""
                  />
                  <MoreDataForm
                    title="Electricity 2019"
                    dataToShow={moreData.elec2019}
                    prefix="billion kWh"
                  />
                  <MoreDataForm
                    title="Oil 2019"
                    dataToShow={moreData.oil2019}
                    prefix="million barrels per day"
                  />
                  <MoreDataForm
                    title="Oil 2020"
                    dataToShow={moreData.oil2020}
                    prefix="million barrels per day"
                  />
                  <MoreDataForm
                    title="Natural Gas 2020"
                    dataToShow={moreData.natGas2020}
                    prefix="Exajoules"
                  />
                  <MoreDataForm
                    title="Coal 2020"
                    dataToShow={moreData.coal2020}
                    prefix="Exajoules"
                  />
                  <MoreDataForm
                    title="Nuclear 2020"
                    dataToShow={moreData.nuclear2020}
                    prefix="Exajoules"
                  />
                  <MoreDataForm
                    title="Hydro 2020"
                    dataToShow={moreData.hydro2020}
                    prefix="Exajoules"
                  />
                  <MoreDataForm
                    title="Renewable 2020"
                    dataToShow={moreData.renewable2020}
                    prefix="Exajoules"
                  />
                  <span
                    className={`${styles.respFontTiny} text-tertiary-600 pt-10`}
                  >
                    *Exajoule is equivalent to one quintillion (a million
                    trillion, or a one followed by 18 zeroes) joules. A joule is
                    a measure of energy equivalent to the amount of electricity
                    required to power a one-watt device for one second of time.
                  </span>
                </motion.div>
              ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Choropleth;
