const express = require('express');
const router = express.Router();

const {signUp, signin, signout ,update, listByUser, listByCorporate, userById} = require('../controllers/user');
const { userSignupValidator } = require('../validators');
const { adminById, isAdmin, requireSigninAdmin } = require("../controllers/admin");

router.post("/user/register", userSignupValidator, signUp);
router.get("/user/by-user/:adminId",requireSigninAdmin,isAdmin,listByUser );
router.get("/user/by-corporate/:adminId",requireSigninAdmin,isAdmin,listByCorporate );
router.post("/user/signin", signin);
router.get("/user/signout", signout);
router.put("/user/update/:userId/:adminId", requireSigninAdmin, isAdmin,update );

router.param("adminId",adminById);
router.param("userId",userById);

module.exports = router;