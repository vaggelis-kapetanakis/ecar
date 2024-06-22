import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../../shared/context/auth-context";
import LoadingSpinner from "../../../../UIElements/LoadingSpinner/LoadingSpinner";
import notifierMiddleware from "../../../../UIElements/Notifier/Notifier";
import Pins from "./pins";
import CityInfo from "./city-info";
import Map, {
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';

const TOKEN = process.env.REACT_APP_MAPBOX_KEY;
const MAPBOX_STYLE = process.env.REACT_APP_MAPBOX_STYLE;

const geolocateStyle = {
  top: 0,
  left: 0,
  padding: "10px",
};

const fullscreenControlStyle = {
  top: 36,
  left: 0,
  padding: "10px",
};

const navStyle = {
  top: 72,
  left: 0,
  padding: "10px",
};

const scaleControlStyle = {
  bottom: 36,
  left: 0,
  padding: "10px",
};

/* const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
    c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
    C20.1,15.8,20.2,15.8,20.2,15.7z`;

const SIZE = 20; */

const StationsMap = React.memo(({ popupInfo, setPopupInfo }) => {
  const auth = useContext(AuthContext);
  const [values, setValues] = useState();
  const [showPopup, setShowPopup] = useState(true);
  const [loading, setLoading] = useState(false);

  const [viewState, setViewState] = useState({
    latitude: 34.418322,
    longitude: -119.3368,
    zoom: 3.5,
    bearing: 0,
    pitch: 0,
  });

  const fetchData = async () => {
    let data = [];
    try {
      setLoading(true);
      await axios
        .get(
          process.env.REACT_APP_BACKEND_URL + `/datastations/${auth.userId}`,
          { headers: { "x-observatory-auth": `Bearer ${auth.token}` } }
        )
        .then((res) => {
          for (const dataObj of res.data.data) {
            data.push(dataObj);
          }
          setValues(data);
          setLoading(false);
        })
        .catch((err) => {
          notifierMiddleware("warning", err.message);
        });
    } catch (err) {
      notifierMiddleware("warning", err.message);
    }
  };

  useEffect(() => {
    fetchData();
    setShowPopup(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [popupInfo]);

  let mapRef = React.createRef();

  return (
    <div>
      {loading && <LoadingSpinner />}
      <Map
        reuseMaps
        ref={mapRef}
        {...viewState}
        mapboxAccessToken={TOKEN}
        style={{ height: "74vh" }}
        mapStyle={MAPBOX_STYLE}
        onMove={(evt) => setViewState(evt.viewState)}
        attributionControl={false}
      >
        <Pins data={values} onClick={setPopupInfo} />
        {popupInfo && showPopup && (
          <Popup
            tipSize={5}
            anchor="top"
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            closeOnClick={false}
            onClose={() => {
              setShowPopup(false);
              setPopupInfo();
            }}
            className="mapbox-popup-id"
          >
            <CityInfo info={popupInfo} />
          </Popup>
        )}
        <GeolocateControl style={geolocateStyle} />
        <FullscreenControl style={fullscreenControlStyle} />
        <NavigationControl style={navStyle} />
        <ScaleControl style={scaleControlStyle} />
      </Map>
    </div>
  );
});

export default StationsMap;
