const mongoose = require("mongoose");
const Post = require("../models/Post");
const HttpError = require("../models/http-error");

const getStations = async (req, res, next) => {
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
};

const getPostById = async (req, res, next) => {
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
};

const createPost = async (req, res, next) => {
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
};

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

  const dateTo = new Date(periodDateTo);

  const curDate = new Date();
  const RequestTimestamp = new Date(curDate.getTime());

  const param1 = periodTo.substring(8, 16);

  const format = periodTo.substring(16, 20);

  console.log(stationId);

  let station;
  let sessionsCount;
  let totalEnergy;
  let stationOperator;
  let operator;

  try {
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
          EnergyDelivered: { $sum: "$EnergyDelivered(kWh)" },
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
        $group: { _id: null, total: { $sum: "$EnergyDelivered(kWh)" } },
      },
    ]);

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

  if (!stationOperator[0].pointObjID[0].OperatorsOid[0]) {
    operator = "null";
  } else {
    operator = stationOperator[0].pointObjID[0].OperatorsOid[0].Title;
  }
  totalEn = totalEnergy[0].total;

  for (var i = 0; i < station.length; i++) {
    station[i].PointID = station[i]._id;
    station[i].PointID = String(station[i].PointID);
    delete station[i]._id;
  }

  SessionsSummaryList = station;

  if (param1 === "&format=" || param1 === "") {
    if (format === "json" || format === "") {
      res.json({
        StationID: stationId,
        Operator: operator,
        RequestTimestamp,
        PeriodFrom: dateFrom.toUTCString(),
        PeriodTo: dateTo.toUTCString(),
        TotalEnergyDelivered: totalEn,
        NumberOfChargingSessions: sessionsCount,
        SessionsSummaryList,
      });
    } else if (format === "csv") {
      let data = {
        StationID: stationId,
        Operator: operator,
        RequestTimestamp,
        PeriodFrom: dateFrom.toUTCString(),
        PeriodTo: dateTo.toUTCString(),
        TotalEnergyDelivered: totalEn,
        NumberOfChargingSessions: sessionsCount,
        SessionsSummaryList,
      };
      const json2csvParser = new json2csv({ header: true });
      const csvData = json2csvParser.parse(data);
      fs.writeFile("./results/postsResults.csv", csvData, function (error) {
        if (error) throw error;
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

exports.getStations = getStations;
exports.createPost = createPost;
exports.getPostById = getPostById;
exports.getSessionsPerStation = getSessionsPerStation;
