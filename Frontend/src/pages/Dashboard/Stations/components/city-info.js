import * as React from "react";
import styles from "../../../../style";

function CityInfo(props) {
  const { info } = props;
  const displayName = `${info._id}`;

  return (
    <div className="bg-bgBlueLight-500 rounded-2xl">
      <div style={{ width: "240px" }}>
        <span className={`${styles.respFontExtraSmall} text-whitesmoke-500`}>
          stationID: {displayName}
        </span>
      </div>
    </div>
  );
}

export default React.memo(CityInfo);
