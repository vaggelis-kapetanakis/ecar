import React, { useState, useEffect } from "react";
import axios from "axios";
import Map, {
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl,
  Marker,
} from "react-map-gl";
import LoadingSpinner from "../../../../../../UIElements/LoadingSpinner/LoadingSpinner";
import CityInfo from "./NearestInfo";
import Pins from "./NearestPins";
import "mapbox-gl/dist/mapbox-gl.css";
import notifierMiddleware from "../../../../../../UIElements/Notifier/Notifier";
import { useQuery } from "react-query";

/* eslint-disable import/no-webpack-loader-syntax */
import mapboxgl from 'mapbox-gl';
// @ts-ignore
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

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

const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
    c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
    C20.1,15.8,20.2,15.8,20.2,15.7z`;

const SIZE = 20;

const fetchMapData = (geoData) => {
  return axios.get(
    process.env.REACT_APP_BACKEND_URL +
      `/nearest/${geoData.geoData.long}/${geoData.geoData.lat}`
  );
};

const NearestPoint = React.memo(({ geoData, popupInfo, setPopupInfo }) => {
  const [values, setValues] = useState();
  const [showPopup, setShowPopup] = React.useState(true);

  const [viewState, setViewState] = useState({
    latitude: geoData.geoData.lat,
    longitude: geoData.geoData.long,
    zoom: 10.5,
    bearing: 0,
    pitch: 0,
  });

  const onSuccess = (data) => {
    let temp = [];
    for (const dataObj of data?.data.closest) {
      temp.push(dataObj);
    }
    setValues(temp);
  };

  const onError = (error) => {
    notifierMiddleware("warning", error.message);
  };

  useQuery("fetch-map-data", () => fetchMapData(geoData), {
    onSuccess,
    onError,
    refetchOnWindowFocus: false,
    enabled: geoData?.geoData?.long !== "",
    retry: 3,
    retryDelay: 1200,
  });

  useEffect(() => {
    setShowPopup(true);
  }, [geoData, popupInfo]);

  let mapRef = React.createRef();

  return (
    <div className="w-full h-full flex">
      {geoData.long === "" ? (
        <LoadingSpinner />
      ) : (
        <div className="w-full h-full">
          <Map
            reuseMaps
            ref={mapRef}
            {...viewState}
            mapboxAccessToken={TOKEN}
            /* mapboxApiAccessToken={TOKEN} */
            /* className="!w-64 !h-64 grow" */
            style={
              window.innerWidth > 1700
                ? {
                    width: `calc(${window.innerWidth}px - 1053px)`,
                    height: `calc(${window.innerHeight}px - 516px)`,
                  }
                : {
                    width: `calc(${window.innerWidth}px - 41px)`,
                    height: `calc(${window.innerHeight}px - 395px)`,
                  }
            }
            mapStyle={MAPBOX_STYLE}
            onMove={(evt) => setViewState(evt.viewState)}
            attributionControl={false}
          >
            <Marker
              latitude={geoData.geoData.lat}
              longitude={geoData.geoData.long}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <div style={{ color: "#fff", marginBottom: "25px" }}>
                You are here
              </div>
              <svg
                height={SIZE}
                viewBox="0 0 24 24"
                style={{
                  cursor: "pointer",
                  fill: "#ff5349",
                  stroke: "none",
                  transform: `translate(${-SIZE / 2}px,${-SIZE}px)`,
                }}
              >
                <path d={ICON} />
              </svg>
            </Marker>
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
                className="text-primary-500 bg-bgBlueLight-500 rounded-2xl pointInfoAdjustment"
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
      )}
    </div>
  );
});

export default NearestPoint;
/* export function renderToDom(container) {
  render(<NearestPoint />, container);
} */
