import React, { useState, useEffect, useContext } from "react";
import TableFormat from "./TableFormat";
/* import LoadingSpinner from "../../../../../UIElements/LoadingSpinner/LoadingSpinner";
import notifierMiddleware from "../../../../../UIElements/Notifier/Notifier";
import { useQuery } from "react-query"; */
import Modal from "../../../../../UIElements/Modal/Modal";
import styles from "../../../../../style";
import { AuthContext } from "../../../../../shared/context/auth-context";

/* const fetchVehicles = (userID) => {
  return axios.get(process.env.REACT_APP_BACKEND_URL + `/cars/user/${userID}`);
}; */

const VehicleOverview = () => {
  const auth = useContext(AuthContext);
  const [tableData, setTableData] = useState([]);
  const [modalId, setModalId] = React.useState("");
  const handleClose = () => setModalId("");
  const rows = [];

  /* const onSuccess = (data) => {
    data?.data.vehicles.forEach((results) => {
      rows.push({
        id: results._id,
        vehicleId: results.id,
        brand: results.brand,
        type: results.type,
        model: results.model,
        average_consumption: results.average_consumption,
        release_year: results.release_year,
      });
    });
    setTableData(rows);
  };

  const onError = (error) => {
    notifierMiddleware("warning", error.message);
  };

  const { isLoading, isError, error, data } = useQuery(
    "fetch-vehicles",
    () => fetchVehicles(userID),
    {
      onSuccess,
      onError,
      refetchOnWindowFocus: false,
    }
  ); */

  const handleSorting = (sortField, sortOrder) => {
    if (sortField) {
      const sorted = [...tableData].sort((a, b) => {
        if (a[sortField] === null) return 1;
        if (b[sortField] === null) return -1;
        if (a[sortField] === null && b[sortField] === null) return 0;
        return (
          a[sortField].toString().localeCompare(b[sortField].toString(), "en", {
            numeric: true,
          }) * (sortOrder === "asc" ? 1 : -1)
        );
      });
      setTableData(sorted);
    }
  };

  /* if (isLoading) {
    return (
      <div>
        <LoadingSpinner asOverlay />
      </div>
    );
  }

  if (isError) {
    return notifierMiddleware("warning", error.message);
  } */

  const fetchVehiclesFromLocal = () => {
    auth.vehicles === []
      ? rows.push({
          id: " ",
          vehicleId: " ",
          brand: " ",
          type: " ",
          model: " ",
          average_consumption: " ",
          release_year: " ",
        })
      : auth.vehicles.forEach((results) => {
          rows.push({
            id: results._id,
            vehicleId: results.id,
            brand: results.brand,
            type: results.type,
            model: results.model,
            average_consumption: results.average_consumption,
            release_year: results.release_year,
          });
          setTableData(rows);
        });
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchVehiclesFromLocal(), 600);
    return () => clearTimeout(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTableData]);

  return (
    <div
      className="h-full w-full xl:py-10 xl:px-12 md:py-10 md:px-10 xxs:py-3 xxs:px-3 rounded-xl
    flex flex-row items-start justify-between overflow-x-hidden overflow-y-scroll"
    >
      <div className="xl:block xxs:hidden overflow-scroll">
        <TableFormat tableData={tableData} handleSorting={handleSorting} />
      </div>
      <div className="w-full xl:hidden xxs:block">
        <div className="w-full">
          <h1 className={`${styles.respFontNormal} text-white mb-3`}>
            Vehicles
          </h1>
        </div>
        <div className="flex flex-col flex-shrink-0">
          {tableData.map((vehicle, index) => (
            <div
              className="flex justify-between items-center mb-3 border-b-2 border-whitesmoke-500"
              key={index}
            >
              <div className="flex items-center justify-center">
                <h4 className={`${styles.respFontExtraSmall} text-white mr-2`}>
                  {vehicle.brand}
                </h4>
                <h4 className={`${styles.respFontExtraSmall} text-white mr-2`}>
                  {vehicle.model}
                </h4>
              </div>
              <button
                className={`${styles.respFontSmaller} bg-primary-500 text-whitesmoke-500 my-3 card-shadow active:bg-dark1 
              text-sm px-3 py-1 rounded-xl hover:shadow-lg outline-none 
              focus:outline-none ease-linear transition-all duration-150`}
                type="button"
                onClick={() => setModalId(`modal${index}`)}
              >
                Details
              </button>
              <Modal
                showModal={modalId === `modal${index}`}
                setShowModal={handleClose}
                data={vehicle}
              />
            </div>
          ))}
        </div>

        {/* {console.log(showModal)}
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          data={tableData}
        /> */}
      </div>
    </div>
  );
};

export default VehicleOverview;
