const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const Post = require("../models/Post");
const Point = require("../models/Point");
const Operator = require("../models/Operator");
const json2csv = require("json2csv").Parser;
const fs = require("fs");
const { count } = require("../models/Post");

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

  const dateTo = new Date(periodDateTo);

  const curDate = new Date();
  const RequestTimestamp = new Date(curDate.getTime());

  const param1 = periodTo.substring(8, 16);

  const format = periodTo.substring(16, 20);

  let point;
  let sessionsCount;
  let totalEnergy;
  let pointOperator;
  let operator;
  let vehicleType;
  let ChargingSessionsList;

  try {
    point = await Post.find({
      pointID: pointId,
      collectionTime: {
        $gte: dateFrom,
        $lt: dateTo,
      },
    })
      .lean()
      .select(
        "StartedOn FinishedOn sessionID EnergyDelivered(kWh) -_id -pointObjID"
      )
      .populate({
        path: "pointObjID",
        select: "OperatorsOid",
        populate: {
          path: "OperatorsOid",
          select: "Title",
        },
      });

    pointOperator = await Post.find({
      pointID: pointId,
      collectionTime: {
        $gte: dateFrom,
        $lt: dateTo,
      },
    })
      .lean()
      .select("pointObjID")
      .populate({
        path: "pointObjID",
        select: "OperatorsOid",
        populate: {
          path: "OperatorsOid",
          select: "Title",
        },
      });

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
        $group: { _id: null, total: { $sum: "$EnergyDelivered(kWh)" } },
      },
    ]);

    vehicleType = await Post.find({
      pointID: pointId,
      collectionTime: {
        $gte: dateFrom,
        $lt: dateTo,
      },
    })
      .lean()
      .select("vehicleObjID")
      .populate({
        path: "vehicleObjID",
        select: "type",
      });

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

  if (!pointOperator[0].pointObjID[0].OperatorsOid[0]) {
    operator = "null";
  } else {
    operator = pointOperator[0].pointObjID[0].OperatorsOid[0].Title;
  }
  totalEn = totalEnergy[0].total;
  vehicleT = vehicleType[0].vehicleObjID[0].type;

  for (var i = 0; i < point.length; i++) {
    point[i].SessionIndex = i + 1;
    point[i].VehicleType = vehicleType[i].vehicleObjID[0].type;
  }

  ChargingSessionsList = point;

  if (param1 === "&format=" || param1 === "") {
    if (format === "json" || format === "") {
      res.json({
        Point: pointId.toString(),
        PointOperator: operator,
        RequestTimestamp,
        PeriodFrom: dateFrom.toUTCString(),
        PeriodTo: dateTo.toUTCString(),
        NumberOfChargingSessions: sessionsCount,
        EnergyDelivered: totalEn,
        ChargingSessionsList,
      });
    } else if (format === "csv") {
      let data = {
        Point: pointId.toString(),
        PointOperator: operator,
        RequestTimestamp,
        PeriodFrom: dateFrom.toUTCString(),
        PeriodTo: dateTo.toUTCString(),
        NumberOfChargingSessions: sessionsCount,
        EnergyDelivered: totalEn,
        ChargingSessionsList,
      };
      const json2csvParser = new json2csv({ header: true });
      const csvData = json2csvParser.parse(data);
      fs.writeFile("./results/pointResults.csv", csvData, function (error) {
        if (error) throw error;
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

exports.getDataPerPoint = getDataPerPoint;
