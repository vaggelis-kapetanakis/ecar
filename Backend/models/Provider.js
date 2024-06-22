const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProviderSchema = new Schema({
  ID: { type: String, required: true },
  Title: { type: String, required: true },
  TypeLSE: { type: String, required: false },
  Website: { type: String, required: false },
  kWhCost: { type: Number, required: true },
});

module.exports = mongoose.model("Provider", ProviderSchema);
