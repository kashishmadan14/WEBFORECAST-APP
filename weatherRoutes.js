const express = require("express");
const router = express.Router();
const { getWeatherByCity, getSearchHistory } = require("../controllers/weatherController");

// GET /api/weather?city=London&units=metric
router.get("/", getWeatherByCity);

// GET /api/weather/history?limit=5
router.get("/history", getSearchHistory);

module.exports = router;
