const { v4: uuid } = require("uuid");
const { validationResult, check } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Post = require("../models/Post");
const uniq = require("../utils/rmv-duplicates");
const HttpError = require("../models/http-error");
const User = require("../models/user");
const Point = require("../models/Point");

const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return next(
      new HttpError("Fetching users failed, please try again later.", 422)
    );
  }

  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const getUserByUsername = async (req, res, next) => {
  const userUsername = req.params.uname;

  let user;

  try {
    user = await User.findOne({ username: userUsername });
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not find a user.", 400)
    );
  }

  if (!user) {
    return next(
      new HttpError("Could not find a user with the provided username.", 400) //this error for valid input but object not in db
    );
  }

  res.json({ user: user.toObject({ getters: true }) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data", 400)
    );
  }
  const { email, username, password, type } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(
      new HttpError("Signing up failed, please try again later", 400)
    );
  }

  if (existingUser) {
    return next(
      new HttpError("User exists already, please login instead", 400)
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new HttpError("Could not create user, please try again", 400));
  }

  const createdUser = new User({
    email,
    username,
    password: hashedPassword,
    points: 0,
    debt: 0,
    lastCharge: null,
    chargesDate: [],
    vehicles: [],
    apiKey: null,
    type: type,
  });

  try {
    await createdUser.save();
  } catch (err) {
    return next(new HttpError("Signing up failed, please try again", 400));
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: createdUser.id,
        email: createdUser.email,
        username: createdUser.username,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(new HttpError("Signing up failed, please try again", 400));
  }

  createdUser.apiKey = token;

  try {
    await createdUser.save();
  } catch (err) {
    return next(new HttpError("Signing up failed, please try again", 400));
  }

  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.email,
    username: createdUser.username,
    points: createdUser.charges.points,
    debt: createdUser.charges.debt,
    lastCharge: createdUser.charges.lastCharge,
    chargesDate: createdUser.charges.chargesDate,
    token: token,
    type: createdUser.type,
  });
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ username: username });
  } catch (err) {
    return next(
      new HttpError("Logging in failed, please try again later.", 400)
    );
  }

  if (!existingUser) {
    return next(
      new HttpError("Invalid credentials, could not log you in.", 400)
    );
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    return next(
      new HttpError(
        "Could not log you in please check your credentials and try again.",
        400 //server-side error
      )
    );
  }

  if (!isValidPassword) {
    return next(
      new HttpError("Invalid credentials, could not log you in.", 400) //password not correct (user's fault)
    );
  }

  let token;
  try {
    token = jwt.sign(
      {
        userId: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(new HttpError("Logging in failed, please try again", 400));
  }

  existingUser.apiKey = token;

  try {
    await existingUser.save();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update api key.", 400)
    );
  }

  let userWithVehicles;

  try {
    userWithVehicles = await User.findById(existingUser.id).populate("vehicles");
  } catch (err) {
    return next(
      new HttpError("Fetching vehicles failed, please try again", 500)
    );
  }

  let lastChargeDate = new Date(existingUser.charges.lastCharge).toUTCString();

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    username: existingUser.username,
    points: existingUser.charges.points,
    debt: existingUser.charges.debt,
    lastCharge: lastChargeDate,
    chargesDate: existingUser.charges.chargesDate,
    token: token,
    type: existingUser.type,
    userWithVehicles
  });
};

const getDebtPoints = async (req, res, next) => {
  const userId = req.params.uid;

  let chargeValues;

  try {
    chargeValues = await User.findById(userId)
      .select(
        "charges.debt charges.points charges.chargesDate charges.lastCharge"
      )
      .populate({
        path: "charges.vehicleObjID",
        select: "brand type",
      })
      .lean();
  } catch (err) {
    return next(
      new HttpError(
        "Fetching charge values failed, please try again later",
        400
      )
    );
  }
  res.status(200).json({ chargeValues });
};

const getDataByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userIn;
  let data;
  let dataFinal;

  try {
    userIn = await User.findById(userId).select("userID");
    if (userIn.userID === undefined) {
      data = [{}];
    } else {
      data = await Post.aggregate([
        {
          $match: { userID: userIn.userID },
        },
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
    }

    if (!userIn) {
      return next(
        new HttpError("Could not find a user with the provided id.", 404) //this error for valid input but object not in db
      );
    }
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a user.", //this error for invalid input
      500
    );
    return next(error);
  }

  res.json({
    data,
  });
};

const patchUsersPayment = async (req, res, next) => {
  const userId = req.params.uid;
  const { debt, from, to, points, lastCharge, paymentMethod, vehicleObjID } =
    req.body;

  let existingUser;

  try {
    existingUser = await User.findById(userId);
  } catch (err) {
    return next(
      new HttpError("Adding Payment failed, please try again later", 400)
    );
  }

  let chargesDateTemp = existingUser.charges.chargesDate;
  chargesDateTemp.push(lastCharge);

  existingUser.charges.debt = debt;
  existingUser.charges.from = from;
  existingUser.charges.to = parseInt(to);
  existingUser.charges.points = points;
  existingUser.charges.lastCharge = lastCharge;
  existingUser.charges.chargesDate = chargesDateTemp;
  existingUser.charges.paymentMethod = paymentMethod;
  existingUser.charges.vehicleObjID = vehicleObjID;

  try {
    await existingUser.save();
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong, could not update payment values.",
        400
      )
    );
  }
  res.status(201);
};

const logout = async (req, res, next) => {
  let existingUser;
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    /* const token = req.headers.authorization.split(" ")[1]; */
    const token = req.headers["x-observatory-auth"].split(" ")[1];
    if (!token) {
      throw new Error("Authentication failed", 401);
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY); //validating
    req.userData = { userId: decodedToken.userId };
    existingUser = await User.findById(decodedToken.userId);
  } catch (err) {
    return next(
      new HttpError("Logging out failed, please try again later.", 401)
    );
  }

  existingUser.apiKey = null;

  try {
    await existingUser.save();
  } catch (err) {
    return next(new HttpError("Something went wrong.", 400));
  }

  res.status(200).json({ message: "User logged out" });
};

const getClosestPoints = async (req, res, next) => {
  const long = req.params.long;
  const lat = req.params.lat;

  let closest;

  try {
    closest = await Point.find({
      loc: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [long, lat],
          },
          $maxDistance: 15000,
        },
      },
    })
      .select(
        "kWhCost AddressInfoLatitude AddressInfoLongitude ID Connections stationID"
      )
      .lean();
    if (!closest) {
      return next(new HttpError("Could not find coords.", 400));
    }
  } catch (err) {
    return next(new HttpError(err.message, 400));
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
    delete closest[i].Connections;
    delete closest[i].AddressInfoLatitude;
    delete closest[i].AddressInfoLongitude;
    delete closest[i]._id;
  }

  res.status(200).json({ closest });
};

const checkAvailability = async (req, res, next) => {
  const userId = req.params.uid;

  let availability;

  try {
    availability = await User.findById(userId).select("charges.debt").lean();

    if (!availability) {
      return next(
        new HttpError("Could not find debt for provided user id.", 400)
      );
    }
  } catch (err) {
    return next(new HttpError("Could not find user.", 400));
  }

  if (availability.charges === undefined) {
    availability = true;
  } else {
    if (availability.charges.debt > 100) {
      availability = false;
    } else {
      availability = true;
    }
  }

  res.json({ availability });
};

exports.checkAvailability = checkAvailability;
exports.logout = logout;
exports.getClosestPoints = getClosestPoints;
exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.getUserByUsername = getUserByUsername;
exports.getDataByUserId = getDataByUserId;
exports.patchUsersPayment = patchUsersPayment;
exports.getDebtPoints = getDebtPoints;
