const express = require('express');
const router = express.Router();

const {signUp,signin, signout} = require('../controllers/admin');

router.post("/admin/signup", signUp);
router.post("/admin/signin", signin);
router.get("/admin/signout", signout);


module.exports = router;