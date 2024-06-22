const express = require("express");
const router = express.Router();
const postController = require("../controllers/post-controller");
const vehicleController = require("../controllers/vehicle-controller")
const pointController = require("../controllers/point-controller")

router.post("/", postController.createPost);

router.get("/", postController.getStations);

router.get("/:sid", postController.getPostById);

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

module.exports = router;