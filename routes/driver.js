const express = require('express');
const router = express.Router();

const {signUp, signin, signout, remove ,update, list, driverById, read} = require('../controllers/driver');
const { driverSignupValidator } = require('../validators');
const { adminById, isAdmin, requireSigninAdmin } = require("../controllers/admin");

router.post("/driver/register/:adminId", requireSigninAdmin, isAdmin, driverSignupValidator, signUp);
router.get("/driver/list/:adminId",requireSigninAdmin,isAdmin,list );
router.get("/driver/detail/:driverId", read);
router.post("/driver/signin", signin);
router.get("/driver/signout", signout);
router.delete("/driver/delete/:driverId/:adminId", requireSigninAdmin, isAdmin, remove);
router.put("/driver/update/:driverId/:adminId", requireSigninAdmin, isAdmin,update )

router.param("adminId",adminById);
router.param("driverId",driverById);

module.exports = router;