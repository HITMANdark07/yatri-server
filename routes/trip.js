const express = require("express");
const router = express.Router();

const  {requireSigninUser, isuser, userById} = require("../controllers/user");
const { requireSigninAdmin, isAdmin, adminById} = require("../controllers/admin")
const {requestTrip, list, update, tripById, read} = require("../controllers/trip");

router.post("/create/trip/:userId", requireSigninUser,isuser, requestTrip);
router.get("/trips/list", list);
router.get("/trip/details/:tripId",read);
router.put("/trip/update/:tripId/:adminId",requireSigninAdmin, isAdmin,update );

router.param("userId",userById);
router.param("tripId", tripById);
router.param("adminId",adminById);

module.exports = router;

