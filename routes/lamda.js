const express = require("express");
const router = express.Router();

const { getInitialPrice } = require('../controllers/lamda');

router.post("/calculate/charges", getInitialPrice);

module.exports = router;