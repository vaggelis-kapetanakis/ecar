// Metatropi dieuthinsis se latitude kai longitude gia na ta xrhsimopoihsoume gia na emfanisoume
// ston xarth thn topothesia tou xrhsth

const axios = require("axios");

const HttpError = require("../models/http-error");

const API_KEY = "AIzaSyB9kAcy2Fr1ipW93KWYknlHzaxAYyaqu4A";

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}` //Stelnei ena get request sto URL pou einai to encoded address kai mas dinei tis suntetagmenes gia to address pou theloyme
  );

  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for the specified address",
      422
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordsForAddress;
