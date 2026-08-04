import { useState } from "react";

export default function SearchBar({ onSearch, loading, units, onUnitsChange }) {
  const [city, setCity] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(city);
  };

  return (
    <form className="search-panel" onSubmit={handleSubmit}>
      <div className="search-panel__eyebrow">Station lookup</div>
      <div className="search-panel__row">
        <input
          className="search-panel__input"
          type="text"
          placeholder="Search a city — e.g. Lisbon"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          aria-label="City name"
        />
        <button className="search-panel__submit" type="submit" disabled={loading}>
          {loading ? "Reading…" : "Read sky"}
        </button>
      </div>
      <div className="search-panel__units" role="group" aria-label="Units">
        <button
          type="button"
          className={`unit-toggle ${units === "metric" ? "unit-toggle--active" : ""}`}
          onClick={() => onUnitsChange("metric")}
        >
          °C
        </button>
        <button
          type="button"
          className={`unit-toggle ${units === "imperial" ? "unit-toggle--active" : ""}`}
          onClick={() => onUnitsChange("imperial")}
        >
          °F
        </button>
      </div>
    </form>
  );
}
