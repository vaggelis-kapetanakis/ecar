const mongoose = require("mongoose");
const Vehicle = require("../../models/Vehicle");
const HttpError = require("../../models/http-error");
const Post = require("../../models/Post");
const json2csv = require("json2csv").Parser;
const fs = require("fs");
const Point = require("../../models/Point");
const Operator = require("../../models/Operator");
const Provider = require("../../models/Provider");
const User = require("../../models/user");
const os = require("os");
const path = require("path");

/* const getProviders = async (req, res, next) => {
  let providers;

  try {
    providers = await Provider.find().lean();
    if (!providers) {
      return next(
        new HttpError("Could not find providers for the provided id's.", 404) //this error for valid input but object not in db
      );
    }
  } catch (err) {
    return next(
      new HttpError("Fetching providers failed, please try again later.", 422)
    );
  }

  res.json({ providers });
}; */

const getAllProviders = async (req, res, next) => {
  const stationId = req.params.stationID;
  const pointId = Number(req.params.pointID);

  let providersTemp;

  try {
    providersTemp = await Post.find({
      stationID: stationId,
      pointID: pointId,
    })
      .select("_id")
      .populate({
        path: "pointObjID",
        select: "operatorsObjID",
        populate: {
          path: "operatorsObjID",
          select: "providers",
        },
      })
      .lean();

    if (!providersTemp || providersTemp.length === 0) {
      return next(
        new HttpError("Could not find providers for the provided id's.", 400) //this error for valid input but object not in db
      );
    }
  } catch (err) {
    return next(
      new HttpError("Fetching providers failed, please try again later.", 400)
    );
  }

  let providers = [];

  for (
    var i = 0;
    i < providersTemp[0].pointObjID.operatorsObjID[0].providers.length;
    i++
  ) {
    try {
      providersFinal = await Provider.findById(
        providersTemp[0].pointObjID.operatorsObjID[0].providers[i]
      );
    } catch (err) {
      return next(
        new HttpError("Fetching providers failed, please try again later.", 422)
      );
    }
    providers.push(providersFinal);
  }

  res.json({ providers });
};

const getSessionsPerProvider = async (req, res, next) => {
  const providerId = req.params.providerID;
  const periodFrom = req.params.yyyymmdd_from;
  const periodTo = req.params.yyyymmdd_to;

  const yearFrom = periodFrom.substring(0, 4);
  const monthFrom = periodFrom.substring(4, 6);
  const dayFrom = periodFrom.substring(6, 8);
  const periodDateFrom = yearFrom + "-" + monthFrom + "-" + dayFrom;

  const dateFrom = new Date(periodDateFrom);

  const yearTo = periodTo.substring(0, 4);
  const monthTo = periodTo.substring(4, 6);
  const dayTo = periodTo.substring(6, 8);
  const periodDateTo = yearTo + "-" + monthTo + "-" + dayTo;

  var dateTo = new Date(periodDateTo);
  dateTo.setDate(dateTo.getDate() + 1);

  const curDate = new Date();
  const RequestTimestamp = new Date(curDate.getTime());

  const param1 = periodTo.substring(8, 16);

  const format = periodTo.substring(16, 20);

  if (periodFrom.length != 8 || periodTo.length < 8) {
    return next(new HttpError("Bad Date length", 400));
  }

  if (dayFrom > 31 || dayTo > 31) {
    return next(
      new HttpError("There are no more than 31 days in a month", 400)
    );
  }

  const validFrom =
    dayFrom === "31" &&
    (monthFrom === "04" ||
      monthFrom === "06" ||
      monthFrom === "09" ||
      monthFrom === "11");
  const validTo =
    dayTo === "31" &&
    (monthTo === "04" ||
      monthTo === "06" ||
      monthTo === "09" ||
      monthTo === "11");
  const FebFrom =
    (dayFrom > 28 && monthFrom === "02" && yearFrom !== "2020") ||
    (dayFrom > 29 && monthFrom === "02" && yearFrom === "2020");
  const FebTo =
    (dayTo > 28 && monthTo === "02" && yearTo !== "2020") ||
    (dayTo > 29 && monthTo === "02" && yearTo === "2020");

  if (validFrom || validTo || FebFrom || FebTo) {
    return next(new HttpError("Invalid Date", 400));
  }

  if (monthFrom > 12 || monthTo > 12) {
    return next(
      new HttpError("There are no more than 12 months in a year", 400)
    );
  }

  if (dateFrom >= curDate || dateTo > curDate) {
    return next(new HttpError("Invalid Date", 400));
  }

  if (dateFrom >= dateTo) {
    return next(new HttpError("Bad Date order", 400));
  }

  let provider;
  let cost;
  let valid;

  try {
    valid = await Provider.find({ ID: providerId });
    if (valid.length === 0) {
      return next(
        new HttpError("Could not find a provider with the current id.", 400) //this error for valid input but object not in db
      );
    }

    provider = await Post.find({
      providerID: providerId,
      collectionTime: {
        $gte: dateFrom,
        $lt: dateTo,
      },
    })
      .lean()
      .select(
        "providerID sessionID stationID vehicleID StartedOn FinishedOn EnergyDelivered -_id"
      )
      .populate({
        path: "providerObjID",
        select: "Title",
      });

    cost = await Post.find({
      providerID: providerId,
      collectionTime: {
        $gte: dateFrom,
        $lt: dateTo,
      },
    })
      .lean()
      .select("pointObjID")
      .populate({
        path: "pointObjID",
        select: "kWhCost",
      });

    if (!provider) {
      return next(
        new HttpError("Could not find a point with the provided id.", 400) //this error for valid input but object not in db
      );
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a provider.", //this error for invalid input
      400
    );
    return next(error);
  }

  if (provider.length === 0) {
    return next(
      new HttpError("Could not find sessions for selected period", 402)
    );
  }

  provider = provider.sort(
    (a, b) => new Date(a.StartedOn) - new Date(b.StartedOn)
  );

  for (var i = 0; i < provider.length; i++) {
    provider[i].ProviderName = provider[i].providerObjID.Title;
    provider[i].StartedOn = new Date(provider[i].StartedOn)
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");
    provider[i].FinishedOn = new Date(provider[i].FinishedOn)
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");
    provider[i].CostPerKWh = cost[i].pointObjID.kWhCost;
    provider[i].TotalCost =
      1.0 * (provider[i].EnergyDelivered * provider[i].CostPerKWh).toFixed(3);
    delete provider[i].providerObjID;
    provider[i].SessionID = provider[i].sessionID;
    provider[i].StationID = provider[i].stationID;
    if (provider[i].vehicleID === undefined) {
      provider[i].VehicleID = "null";
    } else {
      provider[i].VehicleID = provider[i].vehicleID;
    }
    provider[i].ProviderID = provider[i].providerID;
    delete provider[i].sessionID;
    delete provider[i].stationID;
    delete provider[i].vehicleID;
    delete provider[i].providerID;
    provider[i] = JSON.parse(
      JSON.stringify(provider[i], [
        "ProviderID",
        "ProviderName",
        "StationID",
        "SessionID",
        "VehicleID",
        "StartedOn",
        "FinishedOn",
        "EnergyDelivered",
        "CostPerKWh",
        "TotalCost",
      ])
    );
  }

  if (param1 === "&format=" || param1 === "") {
    if (format === "json" || format === "") {
      res.json({
        provider,
      });
    } else if (format === "csv") {
      let data = {
        provider,
      };
      dir_home = os.homedir();
      complete = path.join(
        dir_home + "/Desktop/technlog/backend",
        ".providerResults.csv"
      );
      const json2csvParser = new json2csv({ header: true });
      const csvData = json2csvParser.parse(data);
      fs.writeFile(complete, csvData, function (error) {
        if (error) throw error;
        setTimeout(() => deleteFile(complete), 5000);
        console.log("Write to providerResults.csv successfully!");
      });
      res
        .status(200)
        .json({ message: "Write to providerResults.csv successfully!" });
    } else {
      res.status(400).json({
        message:
          "Invalid format parameter input, correct format is yyyymmdd and then json or csv.",
      });
    }
  } else {
    res.status(400).json({
      message: "Correct format is yyyymmdd + '&format=' and then csv or json.",
    });
  }
};

const deleteFile = (complete) => {
  fs.unlink(complete, (err) => {
    if (err) throw err;
  });
};

const getStationsByProvider = async (req, res, next) => {
  const providerId = req.params.pid;

  let provider1;
  let provider2;
  let data;
  let station;
  let stationData = [];

  try {
    provider1 = await User.findById(providerId).select("userID");

    provider2 = await Provider.aggregate([
      {
        $match: { ID: String(provider1.userID) },
      },
    ]);

    data = await Point.aggregate([
      { $match: { providersObjID: provider2[0]._id } },
      {
        $group: {
          _id: "$stationID",
          latitude: { $first: "$AddressInfoLatitude" },
          longitude: { $first: "$AddressInfoLongitude" },
        },
      },
    ]);

    if (!provider1) {
      return next(
        new HttpError("Could not find a provider with the provided id.", 404) //this error for valid input but object not in db
      );
    }
  } catch (err) {
    return next(
      new HttpError("Could not find a provider with the provided id.", 404) //this error for valid input but object not in db
    );
  }

  for (var i = 0; i < data.length; i++) {
    try {
      station = await Post.aggregate([
        { $match: { stationID: data[i]._id } },
        {
          $group: {
            _id: "$stationID",
            EnergyDelivered: { $sum: "$EnergyDelivered" },
          },
        },
      ]);
    } catch (err) {
      return next(
        new HttpError("Could not find a station with the provided id.", 404) //this error for valid input but object not in db
      );
    }
    stationData.push(station);
  }

  for (var i = 0; i < stationData.length; i++) {
    stationData[i][0].EnergyDelivered =
      1.0 * stationData[i][0].EnergyDelivered.toFixed(2);
  }

  res.json({ data, stationData });
};

const getDataPerStationID = async (req, res, next) => {
  const stationId = req.params.sid;

  let station;

  try {
    station = await Post.aggregate([
      { $match: { stationID: stationId } },
      {
        $group: {
          _id: {
            year: { $year: "$collectionTime" },
            month: { $month: "$collectionTime" },
          },
          stationID: { $first: "$stationID" },
          EnergyDelivered: { $sum: "$EnergyDelivered" },
        },
      },
    ]).sort({ "_id.year": 1, "_id.month": 1 });
    if (!station || station.length === 0) {
      return next(
        new HttpError("Could not find a station with the provided id.", 400) //this error for valid input but object not in db
      );
    }
  } catch (err) {
    return next(
      new HttpError("Could not find a station with the provided id.", 400) //this error for valid input but object not in db
    );
  }

  for (var i = 0; i < station.length; i++) {
    station[i].EnergyDelivered = 1.0 * station[i].EnergyDelivered.toFixed(2);
  }

  res.json({ station });
};

const getYearlyEnergy = async (req, res, next) => {
  let totalEnergy;

  try {
    totalEnergy = await Post.aggregate([
      { $match: {} },
      {
        $group: {
          _id: {
            year: { $year: "$collectionTime" },
            month: { $month: "$collectionTime" },
          },
          EnergyDelivered: { $sum: "$EnergyDelivered" },
        },
      },
    ]).sort({ "_id.year": 1, "_id.month": 1 });

    if (!totalEnergy) {
      return next(
        new HttpError("Could not retrieve session logs.", 404) //this error for valid input but object not in db
      );
    }
  } catch (err) {
    return next(
      new HttpError("Could not find energy logs.", 404) //this error for valid input but object not in db
    );
  }

  for (var i = 0; i < totalEnergy.length; i++) {
    totalEnergy[i].EnergyDelivered =
      1.0 * totalEnergy[i].EnergyDelivered.toFixed(2);
  }

  res.json({ totalEnergy });
};

exports.getSessionsPerProvider = getSessionsPerProvider;
exports.getAllProviders = getAllProviders;
/* exports.getProviders = getProviders; */
exports.getStationsByProvider = getStationsByProvider;
exports.getDataPerStationID = getDataPerStationID;
exports.getYearlyEnergy = getYearlyEnergy;
