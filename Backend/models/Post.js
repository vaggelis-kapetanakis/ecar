const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  doneChargingTime: { type: String, required: true },
  sessionID: { type: String, required: true },
  stationID: { type: String, required: true },
  userID: { type: Number, required: false },
  userInputs: { type: Array, required: false },
  EnergyDelivered: { type: Number, required: true },
  StartedOn: { type: String, required: true },
  FinishedOn: { type: String, required: true },
  pointObjID: { type: mongoose.Types.ObjectId, ref: "Point" },
  vehicleObjID: { type: mongoose.Types.ObjectId, ref: "Vehicle" },
  protocol: { type: String, required: true },
  providerObjID: { type: mongoose.Types.ObjectId, ref: "Provider" },
  pointID: { type: Number, required: true },
  vehicleID: { type: String, required: true },
  providerID: { type: String, required: true },
  collectionTime: { type: Date, required: true },
});

module.exports = mongoose.model("Post", PostSchema);
