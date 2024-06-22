const express = require("express");
const router = express.Router();
const vehiclesController = require("../controllers/vehicle-controller");

router.get(
  "/SessionsPerEV/:vehicleID/:yyyymmdd_from/:yyyymmdd_to",
  vehiclesController.getDataPerVehicle
);

/* router.get(
  "/SessionsPerPoint/:pointID/:yyyymmdd_from/:yyyymmdd_to",
  postController.getSessionsPerPoint
); */

module.exports = router;
