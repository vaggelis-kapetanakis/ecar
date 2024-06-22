const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const compression = require("compression");
const userRoutes = require("./routes/user-routes");
const stationsRoutes = require("./routes/stations-routes");
const evRoutes = require("./routes/evcharge-routes");
const HttpError = require("./models/http-error");
const carRoutes = require("./routes/car-routes");
const cors = require("cors");
const app = express();

let allowedOrigins = [
  "https://ecar-vagkap.web.app",
  "http://localhost:3000",
  "http://localhost",
];

var corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Enable credentials if needed
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));
app.use(compression({ level: 6 }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/evcharge/api", userRoutes);
app.use("/evcharge/api", evRoutes);
app.use("/evcharge/api/cars", carRoutes);
app.use("/evcharge/api/stations", stationsRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  return next(error);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jc4cx.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(process.env.PORT || 8765);
    /* https.createServer(options, app).listen(8765); */
  })
  .catch((err) => {
    console.log(err);
  });
