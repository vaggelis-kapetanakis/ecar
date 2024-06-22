const mongoose = require("mongoose");

const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: false },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8 },
  charges: {
    debt: { type: Number, required: false },
    from: { type: Number, required: false },
    to: { type: Number, required: false },
    points: { type: Number, required: false },
    lastCharge: { type: Date, required: false },
    chargesDate: [{ type: Date, required: false }],
    paymentMethod: { type: String, required: false },
    vehicleObjID: {
      type: mongoose.Types.ObjectId,
      required: false,
      ref: "Vehicle",
    },
  },
  userID: { type: Number, required: false },
  vehicles: [
    { type: mongoose.Types.ObjectId, required: false, ref: "Vehicle" },
  ],
  apiKey: { type: String, required: false },
  type: { type: String, required: false },
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
