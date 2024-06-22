import React from "react";
import LoadingSpinner from "../../../../../UIElements/LoadingSpinner/LoadingSpinner";
import NearestPoint from "./components/NearestPoint";

const Maps = React.memo(({ geoData, popupInfo, setPopupInfo }) => {
  return (
    <div>
      {geoData.geoData.long === "" ? (
        
        <LoadingSpinner />
      ) : (
        <NearestPoint
          geoData={geoData}
          popupInfo={popupInfo}
          setPopupInfo={setPopupInfo}
        />
      )}
    </div>
  );
});

export default Maps;
