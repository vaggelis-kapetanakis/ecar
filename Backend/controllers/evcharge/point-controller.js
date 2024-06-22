const mongoose = require("mongoose");
const HttpError = require("../../models/http-error");
const Post = require("../../models/Post");
const json2csv = require("json2csv").Parser;
const fs = require("fs");
const Point = require("../../models/Point");
const Operator = require("../../models/Operator");
const Provider = require("../../models/Provider");
const Vehicle = require("../../models/Vehicle");
const os = require("os");
const path = require("path");

const getDataPerPoint = async (req, res, next) => {
  const pointId = Number(req.params.pointID);

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

  let point;
  let sessionsCount;
  let totalEnergy;
  let pointOperator;
  let operator;
  let valid;
  let ChargingSessionsList;

  try {
    valid = await Point.find({ ID: pointId });
    if (valid.length === 0) {
      return next(
        new HttpError("Could not find a point with the provided id.", 400) //this error for valid input but object not in db
      );
    }

    point = await Post.find({
      pointID: pointId,
      collectionTime: {
        $gte: dateFrom,
        $lt: dateTo,
      },
    })
      .lean()
      .select(
        "pointID userInputs protocol StartedOn FinishedOn sessionID EnergyDelivered -_id"
      )
      .populate({
        path: "vehicleObjID",
        select: "type",
      });

    pointOperator = await Post.find({
      pointID: pointId,
      collectionTime: {
        $gte: dateFrom,
        $lt: dateTo,
      },
    })
      .select("pointObjID")
      .populate({
        path: "pointObjID",
        select: "operatorsObjID",
        populate: {
          path: "operatorsObjID",
          select: "Title",
        },
      })
      .lean();

    sessionsCount = await Post.find({
      pointID: pointId,
      collectionTime: {
        $gte: dateFrom,
        $lt: dateTo,
      },
    })
      .lean()
      .countDocuments("sessionID");

    totalEnergy = await Post.aggregate([
      {
        $match: {
          $and: [
            { pointID: pointId },
            { collectionTime: { $gte: dateFrom, $lt: dateTo } },
          ],
        },
      },
      {
        $group: { _id: null, total: { $sum: "$EnergyDelivered" } },
      },
    ]);

    if (!point) {
      return next(
        new HttpError("Could not find a point with the provided id.", 404) //this error for valid input but object not in db
      );
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a point.", //this error for invalid input
      500
    );
    return next(error);
  }

  if (point.length === 0) {
    const error = new HttpError(
      "Could not find sessions for selected time period.", //this error for invalid input
      402
    );
    return next(error);
  } else {
    if (!pointOperator[0].pointObjID.operatorsObjID[0]) {
      operator = "null";
    } else {
      operator = pointOperator[0].pointObjID.operatorsObjID[0].Title;
    }
    totalEn = totalEnergy[0].total;

    point = point.sort((a, b) => new Date(a.StartedOn) - new Date(b.StartedOn));

    for (var i = 0; i < point.length; i++) {
      point[i].SessionIndex = i + 1;
      if (!point[i].vehicleObjID) {
        point[i].VehicleType = null;
      } else {
        point[i].VehicleType = point[i].vehicleObjID.type;
      }
      point[i].StartedOn = new Date(point[i].StartedOn)
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
      point[i].FinishedOn = new Date(point[i].FinishedOn)
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
      if (point[i].userInputs !== null && point[i].userInputs.length !== 0) {
        for (var j = 0; j < point[i].userInputs.length; j++) {
          if (point[i].userInputs[j] === undefined) {
            point[i].Payment = null;
          } else {
            if (point[i].userInputs[j].payment === undefined) {
              point[i].userInputs[j].payment = null;
            } else {
              point[i].Payment = point[i].userInputs[j].payment;
              point[i].PaymentTimes = j + 1;
            }
          }
        }
      } else {
        point[i].Payment = null;
      }
      point[i].Protocol = point[i].protocol;
      point[i].SessionID = point[i].sessionID;
      delete point[i].sessionID;
      delete point[i].protocol;
      delete point[i].pointID;
      delete point[i].userInputs;
      delete point[i].vehicleObjID;
      point[i] = JSON.parse(
        JSON.stringify(point[i], [
          "SessionIndex",
          "SessionID",
          "StartedOn",
          "FinishedOn",
          "Protocol",
          "EnergyDelivered",
          "Payment",
          "VehicleType",
        ])
      );
    }
  }

  ChargingSessionsList = point;

  if (param1 === "&format=" || param1 === "") {
    if (format === "json" || format === "") {
      res.json({
        Point: pointId.toString(),
        PointOperator: operator,
        RequestTimestamp: new Date()
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, ""),
        PeriodFrom: dateFrom
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, ""),
        PeriodTo: dateTo.toISOString().replace(/T/, " ").replace(/\..+/, ""),
        NumberOfChargingSessions: sessionsCount,
        ChargingSessionsList,
      });
    } else if (format === "csv") {
      let data = {
        Point: pointId.toString(),
        PointOperator: operator,
        RequestTimestamp: new Date()
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, ""),
        PeriodFrom: dateFrom
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, ""),
        PeriodTo: dateTo.toISOString().replace(/T/, " ").replace(/\..+/, ""),
        NumberOfChargingSessions: sessionsCount,
        ChargingSessionsList,
      };
      dir_home = os.homedir();
      complete = path.join(
        dir_home + "/Desktop/technlog/backend",
        ".pointResults.csv"
      );
      const json2csvParser = new json2csv({ header: true });
      const csvData = json2csvParser.parse(data);
      fs.writeFile(complete, csvData, function (error) {
        if (error) throw error;
        setTimeout(() => deleteFile(complete), 5000);
        console.log("Write to pointResults.csv successfully!");
      });
      res
        .status(200)
        .json({ message: "Write to pointResults.csv successfully!" });
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

exports.getDataPerPoint = getDataPerPoint;
