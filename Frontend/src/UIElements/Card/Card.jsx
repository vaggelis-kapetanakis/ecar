import React from "react";
import styles from "../../style";

export const Card = React.memo(({ title, data }) => {
  const renderContent = () => {
    switch (title) {
      case "Debt":
        return (
          <h4 className={`${styles.respFontExtraSmall} text-primary-500`}>
            {data === undefined ? (
              "No data"
            ) : (
              <>
                {data}
                <span className={`${styles.respFontExtraSmall} text-danger-500`}>
                  {" "}
                  / 100 €
                </span>
              </>
            )}
          </h4>
        );
      case "Current Vehicle":
        return (
          <h4 className={`${styles.respFontExtraSmall} text-primary-500`}>
            {" "}
            {data === undefined ? (
              "No data"
            ) : (
              <div className="flex flex-row ">
                <div className="md:mr-5 xxs:mr-2">{data.brand}</div>
                <div>{data.type}</div>
              </div>
            )}
          </h4>
        );
      case "Range until 30% battery":
        let distanceLeft =
          data === undefined
            ? "No data"
            : (
                Math.round(
                  (((data.chargedTo / 100) * data.batterySize -
                    data.batterySize * 0.3) /
                    data.avgCons) *
                    100
                ) / 100
              ).toFixed(2) * 100;
        return (
          <h4 className={`${styles.respFontExtraSmall} text-primary-500`}>
            {distanceLeft}
            <span className={`${styles.respFontExtraSmall} `}> km</span>
          </h4>
        );
      default:
        return (
          <h4 className={`${styles.respFontExtraSmall} text-primary-500`}>
            {data === undefined ? "No data" : data}
          </h4>
        );
    }
  };

  return (
    <div
      className="h-full card-shadow bg-navOp-500 px-5 py-4 rounded-xl
    flex flex-row items-start justify-between overflow-auto"
    >
      <div className="h-full flex items-center justify-center">
        <h2
          className={`${styles.respFontExtraSmall} font-bold text-whitesmoke-500`}
        >
          {title}
        </h2>
      </div>
      <div className="h-full flex items-center justify-center overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
});

export const CardCalendar = React.memo(({ title, data }) => {
  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return (
    <div
      className="h-full card-shadow bg-navOp-500 md:px-10 xxs:px-3 md:pt-10 xxs:pt-3 pb-3 rounded-xl
    flex flex-col items-start justify-start overflow-auto"
    >
      <div className="w-full md:mb-5 xxs:mb-3">
        <h2
          className={`${styles.respFontExtraSmall} font-bold text-whitesmoke-500 md:pb-2 xxs:pb-0`}
        >
          {title}
        </h2>
      </div>
      <div className="w-full md:h-56 xs:h-24 xxs:h-16 text-left overflow-auto">
        {data === undefined || data === "No data"
          ? "No data"
          : data.map((item, index) => (
              <div key={index} className="text-whitesmoke-500 first:text-primary-500">
                <h1 className={`${styles.respFontExtraSmaller} mb-2`}>
                  {index + 1}. &nbsp; &nbsp;
                  {new Date(item).toLocaleDateString("en-US", options)}
                </h1>
              </div>
            ))}
      </div>
      <div className="mt-2">
        <label className={`${styles.respFontTiny} text-whitesmoke-500`}>
          *With <span className="text-primary-500">Blue</span> is the last charge
          you've made
        </label>
      </div>
    </div>
  );
});
