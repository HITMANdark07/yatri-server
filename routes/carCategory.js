const express = require("express");
const router = express.Router();

const { carCategoryById, create, remove, photo, update, read,list } = require("../controllers/carCategory");
const { requireSigninAdmin, isAdmin, adminById } = require("../controllers/admin");

router.post("/admin/cateogry/add/:adminId",requireSigninAdmin, isAdmin, create);
router.get("/category-list", list);
router.put("/admin/category/update/:categoryId/:adminId",requireSigninAdmin, isAdmin, update);
router.delete("/admin/category/delete/:categoryId/:adminId",requireSigninAdmin, isAdmin, remove);
router.get("/category/:categoryId", read);
router.get("/category/photo/:categoryId",photo);

router.param("categoryId", carCategoryById);
router.param("adminId",adminById);

module.exports = router;