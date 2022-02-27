const express = require("express");
const router = express.Router();

const  {requireSigninUser, isuser, userById} = require("../controllers/user");
const {requestTrip} = require("../controllers/trip");

router.post("/create/trip/:userId", requireSigninUser,isuser, requestTrip);

router.param("userId",userById);

module.exports = router;

