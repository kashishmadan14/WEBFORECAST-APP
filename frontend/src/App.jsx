import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import RecentSearches from "./components/RecentSearches";
import { useWeather } from "./hooks/useWeather";
import { fetchSearchHistory } from "./api/weatherApi";

export default function App() {
  const { weather, loading, error, search } = useWeather();
  const [units, setUnits] = useState("metric");
  const [history, setHistory] = useState([]);

  const loadHistory = async () => {
    try {
      const data = await fetchSearchHistory(6);
      setHistory(data);
    } catch {
      // History is a bonus feature — fail silently so it never
      // blocks the core weather-search experience.
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSearch = async (city) => {
    await search(city, units);
    loadHistory();
  };

  const handleUnitsChange = (next) => {
    setUnits(next);
    if (weather) search(weather.city, next);
  };

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__eyebrow">Instrument No. 04</div>
        <h1 className="app__title">Barograph</h1>
        <p className="app__subtitle">A quiet reading of the sky, anywhere on the map.</p>
      </header>

      <main className="app__main">
        <SearchBar
          onSearch={handleSearch}
          loading={loading}
          units={units}
          onUnitsChange={handleUnitsChange}
        />

        <ErrorMessage message={error} />

        {loading && <Loader />}
        {!loading && weather && <WeatherCard weather={weather} units={units} />}
        {!loading && !weather && !error && (
          <div className="empty-state">
            Search a city to take its reading — temperature, humidity, wind,
            and how it actually feels outside.
          </div>
        )}

        <RecentSearches history={history} onSelect={handleSearch} />
      </main>

      <footer className="app__footer">Data via OpenWeatherMap · MERN stack demo</footer>
    </div>
  );
}
