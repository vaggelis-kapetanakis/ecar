import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../../shared/context/auth-context";

const MainOwner = React.lazy(() => import("./MainOwner/MainOwner"));
const MainProvider = React.lazy(() => import("./MainProvider/MainProvider"));

const Main = () => {
  const auth = useContext(AuthContext);
  const geoTake = async () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setGeoData({
        lat: position.coords.latitude,
        long: position.coords.longitude,
        /* lat: 34.03541163646041,
        long: -118.37868709956807, */
      }); // 34.03541163646041 || position.coords.latitude
      /* setLong(position.coords.longitude); */ // -118.37868709956807 || position.coords.longitude
    });
  };

  const [geoData, setGeoData] = useState({
    long: "",
    lat: "",
  });

  useEffect(() => {
    geoTake();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.userId]);

  return (
    <React.Fragment>
      {auth.type === "owner" && <MainOwner geoData={geoData} />}
      {auth.type === "provider" && <MainProvider />}
      {/* {auth.type === "ministry" && <MainMinistry />} */}
    </React.Fragment>
  );
};

export default Main;
