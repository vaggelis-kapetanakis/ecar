import React, { useState, useContext } from "react";
import { AuthContext } from "../../../../shared/context/auth-context";
import styles from "../../../../style";
import { Card, CardCalendar } from "../../../../UIElements/Card/Card";
import axios from "axios";
import LoadingSpinner from "../../../../UIElements/LoadingSpinner/LoadingSpinner";
import notifierMiddleware from "../../../../UIElements/Notifier/Notifier";
import { useQueries } from "react-query";
import VehicleOverview from "./VehicleOverview/VehicleOverview";
import PointInfo from "./Maps/components/PointInfo";

const Maps = React.lazy(() => import("./Maps/Maps"));

const fetchingDistanceLeft = (userID) => {
  return axios.get(
    process.env.REACT_APP_BACKEND_URL + `/cars/distance/${userID}`
  );
};

const fetchChargeValues = (userID) => {
  return axios.get(process.env.REACT_APP_BACKEND_URL + `/charge/${userID}`);
};

const MainOwner = React.memo((geoData) => {
  const auth = useContext(AuthContext);
  const values = {
    debt: auth.debt === null ? "No data" : auth.debt,
    points: auth.points === null ? "No data" : auth.points,
    chargesDates:
      auth.chargesDate === []
        ? "No data"
        : auth.chargesDate.sort(function (a, b) {
            return new Date(b).getTime() - new Date(a).getTime();
          }),
  };
  const [popupInfo, setPopupInfo] = useState();

  const results = useQueries([
    {
      queryKey: "distance-left",
      queryFn: () => fetchingDistanceLeft(auth.userId),
      refetchOnWindowFocus: false,
    },
    {
      queryKey: "charges",
      queryFn: () => fetchChargeValues(auth.userId),
      refetchOnWindowFocus: false,
    },
  ]);

  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);
  const error = results.some((result) => result.error);

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  if (isError) {
    return notifierMiddleware("warning", error.message);
  }

  return (
    <div className="w-auto sm:pt-10 xxs:pt-8">
      <div>
        <h1
          className={`${styles.respFontNormal} border-b-2 border-white 
            border-dotted text-white font-bold w-fit`}
        >
          Dashboard
        </h1>
      </div>
      <div
        className="xl:h-screen xxs:h-[200vh] grid xl:grid-cols-11 xl:grid-rows-7
        xxs:grid-cols-1 xxs:grid-rows-12
       xl:gap-10 xxs:gap-5 mt-5 mb-10"
      >
        <div className="min-w-full min-h-full xl:col-span-2">
          <Card title="Debt" data={values.debt} />
        </div>
        <div className="min-w-full min-h-full xl:col-span-2">
          <Card title="Points" data={values.points} />
        </div>
        <div className="min-w-full min-h-full xl:col-span-4">
          <Card
            title="Current Vehicle"
            data={results[1].data?.data.chargeValues.charges.vehicleObjID}
          />
        </div>
        <div className="min-w-full min-h-full xl:col-span-3">
          <Card title="Range until 30% battery" data={results[0].data?.data} />
        </div>
        <div
          className="h-full bg-navOp-500 rounded-xl
    flex flex-col items-start justify-start overflow-auto xl:row-span-3
    xxs:row-span-2 xl:col-span-6"
        >
          <Maps
            geoData={geoData}
            popupInfo={popupInfo}
            setPopupInfo={setPopupInfo}
          />
        </div>
        <div
          className="h-full card-shadow bg-navOp-500 xl:p-10 xxs:p-3 rounded-xl
    flex flex-col items-start justify-start overflow-auto xl:row-span-3
    xxs:row-span-2 xl:col-span-5"
        >
          <PointInfo geoData={geoData} info={popupInfo} />
        </div>
        <div className="xl:row-span-3 xxs:row-span-2 xl:col-span-3">
          <CardCalendar title="Charges Calendar" data={values.chargesDates} />
        </div>
        <div
          className="h-full card-shadow bg-navOp-500 rounded-xl flex 
          flex-col items-start justify-start overflow-auto xl:row-span-3
          xxs:row-span-2 xl:col-span-8"
        >
          <VehicleOverview userID={auth.userId} />
        </div>
      </div>
    </div>
  );
});

export default MainOwner;
