const axios = require("axios");
const SearchHistory = require("../models/SearchHistory");

const OPENWEATHER_BASE_URL =
  process.env.OPENWEATHER_BASE_URL || "https://api.openweathermap.org/data/2.5";

/**
 * Shapes the raw OpenWeatherMap payload down to only what the frontend needs.
 * Keeping this transformation on the backend means the frontend never has to
 * know about OpenWeatherMap's response shape, and we never leak the API key.
 */
const shapeWeatherResponse = (data) => ({
  city: data.name,
  country: data.sys?.country || "",
  temperature: Math.round(data.main.temp),
  feelsLike: Math.round(data.main.feels_like),
  humidity: data.main.humidity,
  windSpeed: data.wind.speed,
  condition: data.weather?.[0]?.main || "Unknown",
  description: data.weather?.[0]?.description || "",
  icon: data.weather?.[0]?.icon || "01d",
  pressure: data.main.pressure,
  visibility: data.visibility,
  sunrise: data.sys?.sunrise,
  sunset: data.sys?.sunset,
  coord: data.coord,
  timezone: data.timezone,
  fetchedAt: new Date().toISOString(),
});

// @desc    Get current weather for a city
// @route   GET /api/weather?city=London&units=metric
// @access  Public
const getWeatherByCity = async (req, res) => {
  const { city, units = "metric" } = req.query;

  if (!city || !city.trim()) {
    return res.status(400).json({ message: "City name is required." });
  }

  if (!["metric", "imperial"].includes(units)) {
    return res.status(400).json({ message: "units must be 'metric' or 'imperial'." });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      message: "Server misconfiguration: missing weather provider API key.",
    });
  }

  try {
    const response = await axios.get(`${OPENWEATHER_BASE_URL}/weather`, {
      params: {
        q: city.trim(),
        appid: apiKey,
        units,
      },
      timeout: 8000,
    });

    const weather = shapeWeatherResponse(response.data);

    // Fire-and-forget: persist to history but never let a Mongo hiccup
    // fail the actual weather request the user is waiting on.
    SearchHistory.create({
      city: weather.city,
      country: weather.country,
      temperature: weather.temperature,
      condition: weather.condition,
    }).catch((err) => console.error("Failed to save search history:", err.message));

    return res.status(200).json(weather);
  } catch (error) {
    if (error.response) {
      // OpenWeatherMap responded with an error status
      const status = error.response.status;
      if (status === 404) {
        return res.status(404).json({ message: `City "${city}" was not found.` });
      }
      if (status === 401) {
        return res.status(500).json({ message: "Weather provider rejected the API key." });
      }
      return res.status(status).json({
        message: error.response.data?.message || "Weather provider error.",
      });
    }

    if (error.code === "ECONNABORTED") {
      return res.status(504).json({ message: "Weather provider timed out. Try again." });
    }

    console.error("Unexpected weather fetch error:", error.message);
    return res.status(500).json({ message: "Something went wrong fetching the weather." });
  }
};

// @desc    Get most recent searches
// @route   GET /api/weather/history?limit=5
// @access  Public
const getSearchHistory = async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 5, 20);

  try {
    const history = await SearchHistory.find()
      .sort({ searchedAt: -1 })
      .limit(limit)
      .select("city country temperature condition searchedAt -_id");

    return res.status(200).json(history);
  } catch (error) {
    console.error("Failed to fetch search history:", error.message);
    return res.status(500).json({ message: "Could not load search history." });
  }
};

module.exports = { getWeatherByCity, getSearchHistory };
