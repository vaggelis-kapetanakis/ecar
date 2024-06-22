const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StationSchema = new Schema({
  clusterID: { type: Number, required: false },
  siteID: { type: Number, required: false },
  spaceID: { type: String, required: false },
  stationID: { type: String, required: false },
  OperatorID: { type: Number, required: false },
});

module.exports = mongoose.model("Station", StationSchema);
