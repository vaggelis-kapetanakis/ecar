const { v4: uuid } = require("uuid");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const Vehicle = require("../models/Vehicle");
const User = require("../models/user");
const Post = require("../models/Post");
/* const mongooseUniqueValidator = require("mongoose-unique-validator"); */

const getCarById = async (req, res, next) => {
  const carId = req.params.cid;

  let car;

  console.log(carId);

  try {
    car = await Vehicle.findById(carId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not find a car.", 500)
    );
  }
  if (!car) {
    return next(
      new HttpError("Could not find a car for the provided id.", 404)
    );
  }
  res.json({ car: car.toObject({ getters: true }) });
};

const chargeTheCar = async (req, res, next) => {
  const userId = req.params.uid;
  const stationId = req.params.stationID;
  const pointId = Number(req.params.pointID);

  let userWithVehicles;
  let providers;

  try {
    userWithVehicles = await User.findById(userId).populate("vehicles");

    if (!userWithVehicles) {
      return next(
        new HttpError("Could not find vehicle.", 404) //this error for valid input but object not in db
      );
    }
  } catch (err) {
    return next(
      new HttpError("Fetching data failed, please try again later.", 422)
    );
  }

  try {
    providers = await Post.find({
      stationID: stationId,
      pointID: pointId,
    })
      .select("_id")
      .lean();
    if (!providers) {
      return next(
        new HttpError("Could not find station or point.", 404) //this error for valid input but object not in db
      );
    }
  } catch (err) {
    return next(
      new HttpError("Fetching data failed, please try again later.", 422)
    );
  }

  res.json({
    vehicles: userWithVehicles.vehicles.map((car) =>
      car.toObject({ getters: true })
    ),
    providers,
  });
};

const getCarsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithVehicles;

  try {
    userWithVehicles = await User.findById(userId).populate("vehicles");
  } catch (err) {
    return next(
      new HttpError("Fetching vehicles failed, please try again", 500)
    );
  }

  if (!userWithVehicles || userWithVehicles.vehicles.length === 0) {
    return next(
      new HttpError("Could not find cars for the provided user id.", 404)
    );
  }

  res.json({
    vehicles: userWithVehicles.vehicles.map((car) => car),
  });
};

const createCar = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { brand, type, model, release_year, average_consumption, owner } =
    req.body;

  const createdCar = new Vehicle({
    brand,
    type,
    model,
    release_year,
    average_consumption,
    owner,
  });

  let user;

  try {
    user = await User.findById(owner);
  } catch (err) {
    const error = new HttpError(
      "Creating vehicle failed, please try again",
      400
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "We could not find user for provided id, please try again",
      400
    );
    return next(error);
  }

  try {
    // Transaction and session
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdCar.save({ session: sess });
    user.vehicles.push(createdCar);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    // Either database is down or something related to db or validation fails
    const error = new HttpError("Created Car failed, please try again", 400);
    return next(error);
  }
  res.status(201).json({ car: createdCar });
};

const updateCar = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { brand, type, model, release_year, owner, average_consumption } =
    req.body;
  const carId = req.params.cid;

  let car;

  try {
    car = await Vehicle.findById(carId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update car.", 500)
    );
  }

  if (car.owner.toString() !== req.userData.userId) {
    return next(
      new HttpError("You are not allowed to edit this vehicle.", 401)
    );
  }

  car.brand = brand;
  car.type = type;
  car.model = model;
  car.release_year = release_year;
  car.average_consumption = average_consumption;
  car.owner = owner;

  try {
    await car.save();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not update car.", 500)
    );
  }

  res.status(200).json({ car: car.toObject({ getters: true }) });
};
const deleteCar = async (req, res, next) => {
  const carId = req.params.cid;

  let car;

  try {
    car = await Vehicle.findById(carId).populate("owner");
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not delete car.", 400)
    );
  }

  if (!car) {
    return next(
      new HttpError("Could not find vehicle for the provided id.", 400)
    );
  }

  if (car.owner.id !== req.userData.userId) {
    return next(
      new HttpError("You are not allowed to delete this place.", 401)
    );
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await car.remove({ session: sess });
    car.owner.vehicles.pull(car);
    await car.owner.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not delete car.", 400)
    );
  }

  res.status(200).json({ message: "Deleted car" });
};

const getDistanceLeft = async (req, res, next) => {
  const userId = req.params.uid;

  let distance;
  let vehicleId;
  let vehicle;

  try {
    distance = await User.findById(userId)
      .lean()
      .select("charges.to charges.vehicleObjID")
      .populate({
        path: "charges.vehicleObjID",
        select: "usable_battery_size brand_id",
      });
    vehicleId = distance.charges.vehicleObjID;

    vehicle = await Vehicle.findById(vehicleId)
      .lean()
      .select("usable_battery_size average_consumption");

    if (!distance) {
      return next(
        new HttpError("Something went wrong, could not find data.", 400)
      );
    }
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not calculate distance.", 400)
    );
  }

  let chargedTo;
  let batterySize;
  let avgCons;
  if (distance.charges === {} || vehicle === null) {
    chargedTo = 0;
    batterySize = 0;
    avgCons = 0;
  } else {
    chargedTo = distance.charges.to;
    batterySize = vehicle.usable_battery_size;
    avgCons = vehicle.average_consumption;
  }

  res.status(200).json({ chargedTo, batterySize, avgCons });
};

exports.getCarById = getCarById;
exports.getCarsByUserId = getCarsByUserId;
exports.createCar = createCar;
exports.updateCar = updateCar;
exports.deleteCar = deleteCar;
exports.chargeTheCar = chargeTheCar;
exports.getDistanceLeft = getDistanceLeft;
