const mongoose = require("mongoose");
const Vehicle = require("../../models/Vehicle");
const HttpError = require("../../models/http-error");
const Post = require("../../models/Post");
const json2csv = require("json2csv").Parser;
const fs = require("fs");
const Point = require("../../models/Point");
const Operator = require("../../models/Operator");
const Provider = require("../../models/Provider");
const os = require("os");
const path = require("path");

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

  let vehicle;
  let pointsCount;
  let sessionsCount;
  let totalEnergy;
  let provider;
  let valid;

  try {
    valid = await Vehicle.find({ id: vehicleId });
    if (valid.length === 0) {
      return next(
        new HttpError("Could not find a vehicle with the provided id", 400) //this error for valid input but object not in db
      );
    }

    vehicle = await Post.find({
      vehicleID: vehicleId,
      collectionTime: {
        $gte: dateFrom,
        $lt: dateTo,
      },
    })
      .lean()
      .select("StartedOn FinishedOn EnergyDelivered sessionID");

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
          EnergyDelivered: { $sum: "$EnergyDelivered" },
        },
      },
    ]);

    provider = await Post.find({
      vehicleID: vehicleId,
      collectionTime: {
        $gte: dateFrom,
        $lt: dateTo,
      },
    })
      .select("pointObjID")
      .populate({
        path: "pointObjID",
        select: "providersObjID kWhCost",
        populate: {
          path: "providersObjID",
          select: "Title",
        },
      })
      .lean();

    if (!vehicle) {
      return next(
        new HttpError("Could not find a vehicle with the provided id.", 400) //this error for valid input but object not in db
      );
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a vehicle.", //this error for invalid input
      400
    );
    console.log(err.message);
    return next(error);
  }

  if (vehicle.length === 0) {
    return next(
      new HttpError("Could not find sessions for selected period", 402)
    );
  }

  if (!totalEnergy[0]) {
    const error = new HttpError(
      "Could not find a vehicle with the provided id.", //this error for invalid input
      400
    );
    return next(error);
  } else {
    totalEnergyVehicle = totalEnergy[0].EnergyDelivered;
  }

  for (var i = 0; i < pointsCount.length; i++) {
    pointsCount[i].NumberOfVisited = 1;
  }

  for (var i = 1; i < pointsCount.length; i++) {
    pointsCount[i].NumberOfVisited += pointsCount[i - 1].NumberOfVisited;
  }

  total = pointsCount[pointsCount.length - 1].NumberOfVisited;
  vehicle = vehicle.sort(
    (a, b) => new Date(a.StartedOn) - new Date(b.StartedOn)
  );

  for (var i = 0; i < vehicle.length; i++) {
    vehicle[i].SessionIndex = i + 1;
    if (provider[i].pointObjID === undefined) {
      vehicle[i].EnergyProvider = null;
    } else {
      vehicle[i].EnergyProvider =
        provider[i].pointObjID.providersObjID[0].Title;
    }
    vehicle[i].SessionID = vehicle[i].sessionID;
    vehicle[i].StartedOn = new Date(vehicle[i].StartedOn)
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");
    vehicle[i].FinishedOn = new Date(vehicle[i].FinishedOn)
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");
    vehicle[i].CostPerKWh = provider[i].pointObjID.kWhCost;
    vehicle[i].SessionCost =
      1.0 * (vehicle[i].EnergyDelivered * vehicle[i].CostPerKWh).toFixed(3);
    delete vehicle[i]._id;
    vehicle[i] = JSON.parse(
      JSON.stringify(vehicle[i], [
        "SessionIndex",
        "SessionID",
        "EnergyProvider",
        "StartedOn",
        "FinishedOn",
        "EnergyDelivered",
        "CostPerKWh",
        "SessionCost",
      ])
    );
  }

  VehicleChargingSessionsList = vehicle;

  if (param1 === "&format=" || param1 === "") {
    if (format === "json" || format === "") {
      res.json({
        VehicleID: vehicleId,
        RequestTimestamp: new Date()
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, ""),
        PeriodFrom: dateFrom
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, ""),
        PeriodTo: dateTo.toISOString().replace(/T/, " ").replace(/\..+/, ""),
        TotalEnergyConsumed: totalEnergyVehicle,
        NumberOfVisitedPoints: total,
        NumberOfVehicleChargingSessions: sessionsCount,
        VehicleChargingSessionsList,
      });
    } else if (format === "csv") {
      let data = {
        VehicleID: vehicleId,
        RequestTimestamp: new Date()
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, ""),
        PeriodFrom: dateFrom
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, ""),
        PeriodTo: dateTo.toISOString().replace(/T/, " ").replace(/\..+/, ""),
        TotalEnergyConsumed: totalEnergyVehicle,
        NumberOfVisitedPoints: total,
        NumberOfVehicleChargingSessions: sessionsCount,
        VehicleChargingSessionsList,
      };
      dir_home = os.homedir();
      complete = path.join(
        dir_home + "/Desktop/technlog/backend",
        ".vehicleResults.csv"
      );
      const json2csvParser = new json2csv({ header: true });
      const csvData = json2csvParser.parse(data);
      fs.writeFile(complete, csvData, function (error) {
        if (error) throw error;
        setTimeout(() => deleteFile(complete), 5000);
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

const deleteFile = (complete) => {
  fs.unlink(complete, (err) => {
    if (err) throw err;
  });
};

exports.getDataPerVehicle = getDataPerVehicle;

/*

db.posts.find().forEach(function (elem) {
  db.posts.update(
    { _id: elem._id },
    { $set: { collectionTime: new Date(elem.StartedOn) } }
  );
});


use Post (databaseName)
db.posts.find().forEach(function(doc){
  doc.collectionTime=new Date(doc.StartedOn);
  db.posts.save(doc);
})

db.points.find().forEach(function(doc){
doc.loc = {
  "type": "Point",
  "coordinates": [{$toDecimal: doc.AddressInfo.Longitude},{$toDecimal: doc.AddressInfo.Latitude}]
};
db.points.save(doc);
});

db.runCommand({
  update: 'points',
  updates: [{
    q: {},
    u: [{
      $set:{
        loc:{
          "type": "Point",
          "coordinates": ["$AddressInfoLongitude","$AddressInfoLatitude" ]
        }
      }
    }],
    multi:true
  }]
})

where: doc===variable, collectionTime===new field and connectionTime===required values field
collectionTime can also be connectionTime if don't want to add new field


db.points.find().forEach( 
    function(x) {
        db.posts.updateMany(
            { pointObjID: x._id },
            { $set: { pointID: x.ID} },
            { "multi" : true }
        );
    }
);

db.posts.find().forEach(function (x) {
  db.posts.updateMany(
    {},
    { $set: { collectionTime: new Date(x.StartedOn) } },
    { multi: true }
  );
});

where points is the db where the ID is, posts the target collection to add the field, pointObjID the link
between objects and the pointID the new field with the corresponding ID
*/
