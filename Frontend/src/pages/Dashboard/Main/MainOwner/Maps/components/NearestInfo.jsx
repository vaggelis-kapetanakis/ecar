import * as React from "react";
import styles from "../../../../../../style";

function NearestInfo(props) {
  const { info } = props;
  const displayName = `${info.ID}`;

  return (
    <div className="bg-bgBlueLight-500 rounded-2xl">
      <div style={{ width: "240px" }}></div>
      <span className={`${styles.respFontExtraSmall}`}> pointID: {displayName}</span>
    </div>
  );
}

export default React.memo(NearestInfo);
