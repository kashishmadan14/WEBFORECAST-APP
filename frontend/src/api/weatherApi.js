import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

/**
 * Fetches current weather for a city from our backend.
 * The backend, not the frontend, holds the OpenWeatherMap API key.
 */
export const fetchWeather = async (city, units = "metric") => {
  const { data } = await client.get("/weather", { params: { city, units } });
  return data;
};

/**
 * Fetches the most recently searched cities.
 */
export const fetchSearchHistory = async (limit = 5) => {
  const { data } = await client.get("/weather/history", { params: { limit } });
  return data;
};

export default client;
