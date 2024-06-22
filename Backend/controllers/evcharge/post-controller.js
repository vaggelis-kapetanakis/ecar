const mongoose = require("mongoose");
const Post = require("../../models/Post");
const HttpError = require("../../models/http-error");
const json2csv = require("json2csv").Parser;
const fs = require("fs");
const Point = require("../../models/Point");
const Operator = require("../../models/Operator");
const os = require("os");
const path = require("path");

/* const getStations = async (req, res, next) => {
  let stations;

  try {
    stations = await Post.find({});
  } catch (err) {
    return next(
      new HttpError("Fetching users failed, please try again later.", 422)
    );
  }
  res.json({
    stations: stations.map((station) => station.toObject({ getters: true })),
  });
}; */

/* const getPostById = async (req, res, next) => {
  const stationId = req.params.sid;

  let station;

  try {
    station = await Post.find({ stationID: stationId });

    if (!station) {
      return next(
        new HttpError("Could not find a station with the provided id.", 404) //this error for valid input but object not in db
      );
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a station.", //this error for invalid input
      500
    );
    return next(error);
  }
  res.json({ station });
}; */

/* const createPost = async (req, res, next) => {
  const {
    clusterID,
    connectionTime,
    disconnectTime,
    kWhDelivered,
    sessionID,
    siteID,
    stationID,
    timezone,
  } = req.body;

  const createdPost = new Post({
    clusterID,
    connectionTime,
    disconnectTime,
    kWhDelivered,
    sessionID,
    siteID,
    stationID,
    timezone,
  });

  try {
    await createdPost.save();
  } catch (err) {
    const error = new HttpError(
      "Created Station failed, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ post: createdPost });
}; */

const getSessionsPerStation = async (req, res, next) => {
  const stationId = req.params.stationID;
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

  let station;
  let sessionsCount;
  let totalEnergy;
  let stationOperator;
  var operator;
  let valid;

  try {
    valid = await Post.find({ stationID: stationId });
    if (valid.length === 0) {
      return next(
        new HttpError("Could not find a station with the provided id.", 400) //this error for valid input but object not in db
      );
    }

    station = await Post.aggregate([
      {
        $match: {
          $and: [
            { stationID: stationId },
            { collectionTime: { $gte: dateFrom, $lt: dateTo } },
          ],
        },
      },
      {
        $group: {
          _id: "$pointID",
          PointSessions: { $sum: 1 },
          EnergyDelivered: { $sum: "$EnergyDelivered" },
        },
      },
    ]);

    stationOperator = await Post.find({
      stationID: stationId,
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
      stationID: stationId,
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
            { stationID: stationId },
            { collectionTime: { $gte: dateFrom, $lt: dateTo } },
          ],
        },
      },
      {
        $group: { _id: null, total: { $sum: "$EnergyDelivered" } },
      },
    ]);

    if (!station) {
      return next(
        new HttpError("Could not find a station with the provided id.", 400) //this error for valid input but object not in db
      );
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a station.", //this error for invalid input
      400
    );
    return next(error);
  }

  if (station.length === 0) {
    return next(
      new HttpError("Could not find sessions for the selected period", 402)
    );
  }

  if (!stationOperator[0].pointObjID.operatorsObjID[0].Title) {
    operator = "null";
  } else {
    operator = stationOperator[0].pointObjID.operatorsObjID[0].Title;
  }

  totalEn = totalEnergy[0].total;
  /* 
  for (var i = 0; i < stationOperator.length; i++) {
    operator.push({"Title": stationOperator[i].pointObjID[0]});
  } */

  for (var i = 0; i < station.length; i++) {
    station[i].PointID = station[i]._id;
    station[i].PointID = String(station[i].PointID);
    delete station[i]._id;
    station[i] = JSON.parse(
      JSON.stringify(station[i], [
        "PointID",
        "PointSessions",
        "EnergyDelivered",
      ])
    );
  }

  SessionsSummaryList = station;

  if (param1 === "&format=" || param1 === "") {
    if (format === "json" || format === "") {
      res.json({
        StationID: stationId,
        Operator: operator,
        RequestTimestamp: new Date()
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, ""),
        PeriodFrom: dateFrom
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, ""),
        PeriodTo: dateTo.toISOString().replace(/T/, " ").replace(/\..+/, ""),
        TotalEnergyDelivered: totalEn,
        NumberOfChargingSessions: sessionsCount,
        NumberOfActivePoints: station.length,
        SessionsSummaryList,
      });
    } else if (format === "csv") {
      let data = {
        StationID: stationId,
        Operator: operator,
        RequestTimestamp: new Date()
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, ""),
        PeriodFrom: dateFrom
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, ""),
        PeriodTo: dateTo.toISOString().replace(/T/, " ").replace(/\..+/, ""),
        TotalEnergyDelivered: totalEn,
        NumberOfChargingSessions: sessionsCount,
        NumberOfActivePoints: station.length,
        SessionsSummaryList,
      };
      dir_home = os.homedir();
      complete = path.join(
        dir_home + "/Desktop/technlog/backend",
        ".postResults.csv"
      );
      const json2csvParser = new json2csv({ header: true });
      const csvData = json2csvParser.parse(data);
      fs.writeFile(complete, csvData, function (error) {
        if (error) throw error;
        setTimeout(() => deleteFile(complete), 5000);
        console.log("Write to postsResults.csv successfully!");
      });
      res
        .status(200)
        .json({ message: "Write to postsResults.csv successfully!" });
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

/* exports.getStations = getStations;
exports.createPost = createPost;
exports.getPostById = getPostById; */
exports.getSessionsPerStation = getSessionsPerStation;
