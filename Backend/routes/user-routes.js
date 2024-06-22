const express = require("express");
const { check } = require("express-validator");
const checkAuth = require("../middleware/check-auth");
const usersController = require("../controllers/user-controller");

const router = express.Router();

router.get("/", usersController.getUsers);

router.get("/:uname", usersController.getUserByUsername);

router.post(
  "/signup",
  [
    check("email").normalizeEmail().isEmail(), //Test@test.com => test@test.com with normalization
    check("username").not().isEmpty(),
    check("password").isLength({ min: 8 }),
    check("type").not().isEmpty(),
  ],
  usersController.signup
);

router.patch("/login", usersController.login);

router.get("/charge/:uid", usersController.getDebtPoints);

router.get("/data/:uid", usersController.getDataByUserId);

router.get("/nearest/:long/:lat", usersController.getClosestPoints);

router.post("/logout", usersController.logout);

router.get("/availability/:uid", usersController.checkAvailability);

router.patch("/charge/:uid", usersController.patchUsersPayment);

module.exports = router;
