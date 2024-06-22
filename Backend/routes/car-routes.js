const express = require("express");

const { check } = require("express-validator");

const carControllers = require("../controllers/cars-controller");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();

router.get("/:cid", carControllers.getCarById);

router.get("/user/:uid", carControllers.getCarsByUserId);

router.get("/charge/:uid/:stationID/:pointID", carControllers.chargeTheCar);

router.get("/distance/:uid", carControllers.getDistanceLeft);

/* router.use(checkAuth); */

router.post(
  "/",
  [
    check("brand").not().isEmpty(),
    check("type").not().isEmpty(),
    check("model").not().isEmpty(),
    check("release_year").not().isEmpty(),
    check("owner").not().isEmpty(),
  ],
  carControllers.createCar
);

router.patch(
  "/:cid",
  [
    check("brand").not().isEmpty(),
    check("type").not().isEmpty(),
    check("model").not().isEmpty(),
    check("release_year").not().isEmpty(),
    check("average_consumption").not().isEmpty(),
    check("owner").not().isEmpty(),
  ],
  carControllers.updateCar
);

router.delete("/:cid", carControllers.deleteCar);

module.exports = router;
