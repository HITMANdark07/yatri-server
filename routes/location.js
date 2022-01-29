const express = require("express");
const router = express.Router();

const { create, list,update, remove,read, locationById} = require("../controllers/location");
const { requireSigninAdmin, isAdmin, adminById } = require("../controllers/admin");

router.post("/admin/location/add/:adminId",requireSigninAdmin, isAdmin, create);
router.get("/location/list", list);
router.get("/location/details/:locationId", read);
router.put("/admin/location/update/:locationId/:adminId",requireSigninAdmin, isAdmin,update );
router.delete("/admin/location/delete/:locationId/:adminId",requireSigninAdmin, isAdmin, remove);


router.param("locationId",locationById);
router.param("adminId",adminById);

module.exports = router;