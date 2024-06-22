const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OperatorSchema = new Schema({
  ID: { type: Number, required: true },
  Title: { type: String, required: true },
  WebsiteUrl: { type: String, required: false },
  Comments: { type: String, required: false },
  PhonePrimaryContact: { type: String, required: false },
  PhoneSecondaryContact: { type: String, required: false },
  IsPrivateIndividual: { type: Boolean, required: true },
  AddressInfo: { type: String, required: false },
  BookingURL: { type: String, required: false },
  ContactEmail: { type: String, required: false },
  FaultReportEmail: { type: String, required: false },
  IsRestrictedEdit: { type: Boolean, required: true },
  providers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Provider" }],
});

module.exports = mongoose.model("Operator", OperatorSchema);
