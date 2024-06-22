import * as React from "react";

function ControlPanel() {
  return (
    <div className="control-panel">
      <h3>Marker, Popup, NavigationControl and FullscreenControl </h3>
      <p>Map showing stations of current provider.</p>
    </div>
  );
}

export default React.memo(ControlPanel);
