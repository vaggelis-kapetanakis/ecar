const express = require("express");
const { check } = require("express-validator");

const stationsController = require("../controllers/stations-controller");

const router = express.Router();

router.get(
  "/datastations/ministry/:long/:lat",
  stationsController.dataStationsMinistry
);

router.get("/moreinfo/:stationId", stationsController.getStationData);

module.exports = router;
