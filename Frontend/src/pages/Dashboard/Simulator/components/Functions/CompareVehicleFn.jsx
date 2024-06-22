import axios from "axios";

export const compareVehicleFn = async (
  userID,
  vehicleID,
  stationID,
  pointID
) => {
  try {
    const results = await axios.get(
      process.env.REACT_APP_BACKEND_URL +
        `/cars/charge/${userID}/${stationID}/${pointID}`
    );
    let something = new Set();
    if (!results) {
      return console.log("nothing", results);
    } else {
      for (var i = 0; i < results.data.vehicles.length; i++) {
        something.add(results.data.vehicles[i]._id);
      }
      if (something.has(vehicleID) === true && results.data.providers.length !== 0) {
        return true;
      } else {
        return false;
      }
    }
  } catch (err) {
    return err.message;
  }
};
