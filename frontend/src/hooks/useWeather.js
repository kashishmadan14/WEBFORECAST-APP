import { useCallback, useState } from "react";
import { fetchWeather } from "../api/weatherApi";

/**
 * Encapsulates the request-response lifecycle for a weather lookup:
 * loading state, error state, and the last successful result.
 */
export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (city, units = "metric") => {
    const trimmed = city.trim();

    if (!trimmed) {
      setError("Enter a city name to search.");
      return;
    }
    if (trimmed.length < 2) {
      setError("City name is too short.");
      return;
    }
    // Basic guard against obviously invalid input (numbers-only, symbols).
    if (!/^[a-zA-Z\s\-',.]+$/.test(trimmed)) {
      setError("City names can only contain letters, spaces, and hyphens.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeather(trimmed, units);
      setWeather(data);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.code === "ECONNABORTED"
          ? "Request timed out. Check your connection and try again."
          : "Couldn't fetch weather right now. Please try again.");
      setError(message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { weather, loading, error, search };
}
