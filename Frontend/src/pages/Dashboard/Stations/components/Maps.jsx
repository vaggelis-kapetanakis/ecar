import React from "react";
import StationsMap from "./StationsMap";

const Maps = React.memo(({ popupInfo, setPopupInfo }) => {
  return (
    <div className="w-full">
      <StationsMap popupInfo={popupInfo} setPopupInfo={setPopupInfo} />
    </div>
  );
});

export default Maps;
