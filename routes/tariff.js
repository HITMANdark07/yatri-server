const express = require("express");
const router = express.Router();

const { create, list, update, read, remove, tariffById} = require("../controllers/tariff");
const { requireSigninAdmin, isAdmin, adminById } = require("../controllers/admin");

router.post("/admin/tariff/add/:adminId",requireSigninAdmin, isAdmin, create);
router.get("/tariff/list", list);
router.get("/tariff/details/:tariffId", read);
router.put("/admin/tariff/update/:tariffId/:adminId",requireSigninAdmin, isAdmin,update );
router.delete("/admin/tariff/delete/:tariffId/:adminId",requireSigninAdmin, isAdmin, remove);


router.param("tariffId",tariffById);
router.param("adminId",adminById);

module.exports = router;