const mongoose = require("mongoose");
const Vehicle = require("../models/Vehicle");
const HttpError = require("../models/http-error");
const Post = require("../models/Post");
const moment = require("moment");
const mdq = require("mongo-date-query");
const json2csv = require("json2csv").Parser;
const path = require("path");
const fs = require("fs");
const fastCsv = require("fast-csv");
const ws = fs.createWriteStream("results.csv");

const getDataPerVehicle = async (req, res, next) => {
  const vehicleId = req.params.vehicleID;
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

  let vehicle;
  let pointsCount;
  let sessionsCount;
  let totalEnergy;

  try {
    vehicle = await Post.find({
      vehicleID: vehicleId,
      collectionTime: {
        $gte: dateFrom,
        $lt: dateTo,
      },
    })
      .lean()
      .select(" StartedOn FinishedOn EnergyDelivered(kWh) sessionID");

    pointsCount = await Post.aggregate([
      {
        $match: {
          $and: [
            { vehicleID: vehicleId },
            { collectionTime: { $gte: dateFrom, $lt: dateTo } },
          ],
        },
      },
      {
        $group: {
          _id: "$pointID",
          NumberOfVisited: { $sum: 1 },
        },
      },
    ]);

    sessionsCount = await Post.find(
      {
        vehicleID: vehicleId,
        collectionTime: {
          $gte: dateFrom,
          $lt: dateTo,
        },
      },
      "-sessionID"
    )
      .lean()
      .populate("vehicles")
      .select("vehicleID collectionTime kWhDelivered sessionID")
      .countDocuments("sessionID");

    totalEnergy = await Post.aggregate([
      {
        $match: {
          $and: [
            { vehicleID: vehicleId },
            { collectionTime: { $gte: dateFrom, $lt: dateTo } },
          ],
        },
      },
      {
        $group: {
          _id: "$vehicleID",
          VehicleSessions: { $sum: 1 },
          EnergyDelivered: { $sum: "$EnergyDelivered(kWh)" },
        },
      },
    ]);

    if (!vehicle) {
      return next(
        new HttpError("Could not find a vehicle with the provided id.", 404) //this error for valid input but object not in db
      );
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a vehicle.", //this error for invalid input
      500
    );
    return next(error);
  }

  totalEnergyVehicle = totalEnergy[0].EnergyDelivered;

  for (var i = 0; i < pointsCount.length; i++) {
    pointsCount[i].NumberOfVisited = 1;
  }

  for (var i = 1; i < pointsCount.length; i++) {
    pointsCount[i].NumberOfVisited += pointsCount[i - 1].NumberOfVisited;
  }

  total = pointsCount[pointsCount.length - 1].NumberOfVisited;

  for (var i = 0; i < vehicle.length; i++) {
    vehicle[i].SessionIndex = i + 1;
    delete vehicle[i]._id;
  }

  VehicleChargingSessionsList = vehicle;

  if (param1 === "&format=" || param1 === "") {
    if (format === "json" || format === "") {
      res.json({
        vehicleID: vehicleId,
        RequestTimestamp,
        PeriodFrom: dateFrom.toUTCString(),
        PeriodTo: dateTo.toUTCString(),
        TotalEnergyConsumed: totalEnergyVehicle,
        NumberOfVisitedPoints: total,
        NumberOfVehicleChargingSessions: sessionsCount,
        VehicleChargingSessionsList,
      });
    } else if (format === "csv") {
      let data = {
        vehicleID: vehicleId,
        RequestTimestamp,
        PeriodFrom: dateFrom.toUTCString(),
        PeriodTo: dateTo.toUTCString(),
        TotalEnergyConsumed: totalEnergy,
        NumberOfVisitedPoints: pointsCount,
        NumberOfVehicleChargingSessions: sessionsCount,
        vehicle,
      };
      const json2csvParser = new json2csv({ header: true });
      const csvData = json2csvParser.parse(data);
      fs.writeFile("./results/vehicleResults.csv", csvData, function (error) {
        if (error) throw error;
        console.log("Write to vehicleResults.csv successfully!");
      });
      res
        .status(200)
        .json({ message: "Write to vehicleResults.csv successfully!" });
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

exports.getDataPerVehicle = getDataPerVehicle;

/*
use Post (databaseName)
db.posts.find().forEach(function(doc){
  doc.collectionTime=new Date(doc.connectionTime);
  db.posts.save(doc);
})

where: doc===variable, collectionTime===new field and connectionTime===required values field
collectionTime can also be connectionTime if don't want to add new field

db.posts_obj.find().forEach(function(err,doc){
  db.points_obj.findOne({_id: doc.pointID}), function(err,item) {
    db.posts_obj.update({_id: doc._id}, {$set: {pointsID: item.ID}}, function(err,res){})
  }
})

db.points_obj.find().forEach( 
    function(x) {
        db.tests.update(
            { pointID: x._id },
            { $set: { pointsID: x.ID} },
            { "multi" : true }
        );
    }
);
*/
