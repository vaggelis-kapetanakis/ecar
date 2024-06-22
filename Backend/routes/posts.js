const express = require("express");
const router = express.Router();
const postController = require("../controllers/post-controller");

router.post("/", postController.createPost);

router.get("/", postController.getStations);

router.get("/:sid", postController.getPostById);

router.get(
  "/SessionsPerPoint/:stationID/:yyyymmdd_from/:yyyymmdd_to?format={json|csv}",
  postController.getSessionsPerStation
);

/* router.get(
  "/SessionsPerPoint/:pointID/:yyyymmdd_from/:yyyymmdd_to",
  postController.getSessionsPerPoint
); */

module.exports = router;
