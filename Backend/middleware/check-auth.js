const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: 'Bearer TOKEN
    if (!token) {
      throw new Error("Authentication failed hahaha", 401);
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY); //validating
    req.userData = { userId: decodedToken.userId }; //adding data to request
    next();
  } catch (err) {
    const error = new HttpError("Authentication failed hewhehe", 401);
    return next(error);
  }
};
