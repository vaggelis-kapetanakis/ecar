const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsForAddress = require("../utils/location");
const Post = require("../models/Post");
const User = require("../models/user");
const Point = require("../models/Point");
const Station = require("../models/Station");
const Operator = require("../models/Operator");

const dataStationsMinistry = async (req, res, next) => {
  const long = req.params.long;
  const lat = req.params.lat;

  let closest;
  let data = [];
  let set = new Set();

  try {
    closest = await Point.find({
      loc: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [long, lat],
          },
          $maxDistance: 10000,
        },
      },
    })
      .select(
        "providersObjID stationID kWhCost AddressInfoLatitude AddressInfoLongitude ID Connections"
      )
      .populate({
        path: "providersObjID",
        select: "Title",
      })
      .lean();
    if (!closest) {
      return next(new HttpError("Could not find coords.", 400));
    }
  } catch (err) {
    return next(new HttpError("Something went wrong.", 400));
  }

  for (var i = 0; i < closest.length; i++) {
    closest[i].latitude = new Number(closest[i].AddressInfoLatitude);
    closest[i].longitude = closest[i].AddressInfoLongitude;
    closest[i].pointID = closest[i].ID;
    closest[i].Cost = closest[i].kWhCost;
    closest[i].Index = i + 1;
    for (var j = 0; j < closest[i].Connections.length; j++) {
      if (!closest[i].Connections[j].Level) {
        closest[i].Level = null;
      } else {
        closest[i].Level = closest[i].Connections[j].Level.Title;
      }
      if (!closest[i].Connections[j].Level) {
        closest[i].IsFastCharge = null;
      } else {
        closest[i].IsFastCharge =
          closest[i].Connections[j].Level.IsFastChargeCapable;
      }
    }
    if (set.has(closest[i].stationID) === false) {
      set.add(closest[i].stationID);
      data.push({
        stationID: closest[i].stationID,
        longitude: closest[i].longitude,
        latitude: closest[i].latitude,
        providerName: closest[i].providersObjID[0].Title,
      });
    } else {
      continue;
    }
    delete closest[i].Connections;
    delete closest[i].AddressInfoLatitude;
    delete closest[i].AddressInfoLongitude;
    delete closest[i]._id;
  }

  res.status(200).json({ data });
};

const getStationData = async (req, res, next) => {
  const stationId = req.params.stationId;

  let data;
  let totalData = {
    stationInfo: {},
    operatorInfo: {},
  };
  let operator;

  try {
    data = await Station.find({ stationID: stationId })
      .then(async (res) => {
        if (!res) {
          const error = new HttpError(
            "Could not find a station with the provided id.", //this error for invalid input
            404
          );
          return next(error);
        }
        totalData.stationInfo = res;
        totalData.operatorInfo = await Operator.find({ ID: res[0].OperatorID });
      })
      .catch((err) => {
        const error = new HttpError(
          "Something went wrong, could not find a station.", //this error for invalid input
          500
        );
        return next(error);
      });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a station.", //this error for invalid input
      500
    );
    return next(error);
  }

  res.status(200).json({ totalData });
};

exports.dataStationsMinistry = dataStationsMinistry;
exports.getStationData = getStationData;
