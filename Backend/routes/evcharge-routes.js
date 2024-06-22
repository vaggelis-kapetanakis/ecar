const express = require("express");
const router = express.Router();
const postController = require("../controllers/evcharge/post-controller");
const vehicleController = require("../controllers/evcharge/vehicle-controller");
const pointController = require("../controllers/evcharge/point-controller");
const providerController = require("../controllers/evcharge/provider-controller");
const checkAuth = require("../middleware/check-auth");

/* router.post("/", postController.createPost); */

/* router.get("/providers", providerController.getProviders); */

router.get(
  "/providers/:stationID/:pointID",
  providerController.getAllProviders
);

/* router.get("/", postController.getStations); */

/* router.get("/softeng/:sid", postController.getPostById); */


router.get("/datastations/:pid", providerController.getStationsByProvider);

router.get(
  "/datastations/provider/:sid",
  providerController.getDataPerStationID
);

// The below is to be removed
router.get("/datastations/totaldata/2020", providerController.getYearlyEnergy);


/* router.use(checkAuth); */

router.get(
  "/SessionsPerStation/:stationID/:yyyymmdd_from/:yyyymmdd_to",
  postController.getSessionsPerStation
);

router.get(
  "/SessionsPerEV/:vehicleID/:yyyymmdd_from/:yyyymmdd_to",
  vehicleController.getDataPerVehicle
);

router.get(
  "/SessionsPerPoint/:pointID/:yyyymmdd_from/:yyyymmdd_to",
  pointController.getDataPerPoint
);

router.get(
  "/SessionsPerProvider/:providerID/:yyyymmdd_from/:yyyymmdd_to",
  providerController.getSessionsPerProvider
);

module.exports = router;
