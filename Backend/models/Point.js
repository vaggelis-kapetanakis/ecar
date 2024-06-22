const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PointSchema = new Schema({
  ID: { type: Number, required: true },
  OperatorID: { type: String, required: true },
  UsageTypeID: { type: Number, required: true },
  Connections: [
    {
      ID: { type: Number, required: false },
      ConnectionType: {
        ID: { type: Number, required: false },
        Title: { type: String, required: false },
        FormalName: { type: String, required: false },
        IsDisconnected: { type: Boolean, required: false },
        IsObsolete: { type: Boolean, required: false },
      },
      Reference: { type: String, required: false },
      StatusTypeID: { type: String, required: false },
      StatusType: { type: String, required: false },
      LevelID: { type: Number, required: false },
      Level: {
        ID: { type: Number, required: false },
        Title: { type: String, required: false },
        Comments: { type: String, required: false },
        IsFastChargeCapable: { type: Boolean, required: false },
      },
      Amps: { type: String, required: false },
      Voltage: { type: String, required: false },
      PowerKW: { type: String, required: false },
      CurrentTypeID: { type: String, required: false },
      CurrentType: {
        ID: { type: Number, required: false },
        Title: { type: String, required: false },
        Description: { type: String, required: false },
      },
      Comments: { type: String, required: false },
    },
  ],
  NumberOfPoints: { type: Number, required: false },
  kWhDelivered: { type: Number, required: true },
  sessionID: { type: String, required: true },
  stationID: { type: String, required: true },
  kWhCost: { type: Number, required: true },
  AddressInfoLatitude: { type: Number, required: true },
  AddressInfoLongitude: { type: Number, required: true },
  operatorsObjID: [{ type: mongoose.Schema.Types.ObjectId, ref: "Operator" }],
  providersObjID: [{ type: mongoose.Schema.Types.ObjectId, ref: "Provider" }],
  providerID: { type: String, required: true },
  loc: {
    type: { type: String, required: false },
    coordinates: { type: Array, required: false },
  },
});

module.exports = mongoose.model("Point", PointSchema);
