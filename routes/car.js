const express = require("express");
const router = express.Router();

const { create, list, update, read, remove, carById} = require("../controllers/car");
const { requireSigninAdmin, isAdmin, adminById } = require("../controllers/admin");

router.post("/admin/car/add/:adminId",requireSigninAdmin, isAdmin, create);
router.get("/car/list", list);
router.get("/car/details/:carById", read);
router.put("/admin/car/update/:carById/:adminId",requireSigninAdmin, isAdmin,update );
router.delete("/admin/car/delete/:carById/:adminId",requireSigninAdmin, isAdmin, remove);


router.param("carById",carById);
router.param("adminId",adminById);

module.exports = router;