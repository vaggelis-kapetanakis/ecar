const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const VehicleSchema = new Schema({
  id: { type: String, required: true },
  brand: { type: String, required: true },
  type: { type: String, required: true },
  brand_id: { type: String, required: true },
  model: { type: String, required: true },
  release_year: { type: Number, required: true },
  variant: { type: String, required: false },
  usable_battery: { type: Number, required: true },
  average_consumption: { type: Number, required: true },
  ac_charger: { type: Object, required: true },
  dc_charger: { type: Object, required: false },
  owner: { type: mongoose.Types.ObjectId, required: true, ref: "User" }, //establishing a relationship between vehicle and user
});

module.exports = mongoose.model("Vehicle", VehicleSchema);
