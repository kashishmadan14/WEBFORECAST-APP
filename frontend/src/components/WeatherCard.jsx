const conditionToSky = {
  Clear: "sky--clear",
  Clouds: "sky--clouds",
  Rain: "sky--rain",
  Drizzle: "sky--rain",
  Thunderstorm: "sky--storm",
  Snow: "sky--snow",
  Mist: "sky--mist",
  Fog: "sky--mist",
  Haze: "sky--mist",
};

function ConditionGlyph({ condition }) {
  // Small hand-drawn-style SVG glyphs, no external icon assets required.
  switch (condition) {
    case "Clear":
      return (
        <svg viewBox="0 0 64 64" className="glyph">
          <circle cx="32" cy="32" r="14" className="glyph__fill" />
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i * Math.PI) / 4;
            const x1 = 32 + Math.cos(angle) * 20;
            const y1 = 32 + Math.sin(angle) * 20;
            const x2 = 32 + Math.cos(angle) * 27;
            const y2 = 32 + Math.sin(angle) * 27;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} className="glyph__ray" />;
          })}
        </svg>
      );
    case "Rain":
    case "Drizzle":
      return (
        <svg viewBox="0 0 64 64" className="glyph">
          <path d="M18 30a12 12 0 0 1 22-7 9 9 0 0 1 10 9 8 8 0 0 1-2 16H18a10 10 0 0 1 0-18z" className="glyph__fill" />
          <line x1="22" y1="48" x2="18" y2="58" className="glyph__ray" />
          <line x1="32" y1="48" x2="28" y2="58" className="glyph__ray" />
          <line x1="42" y1="48" x2="38" y2="58" className="glyph__ray" />
        </svg>
      );
    case "Thunderstorm":
      return (
        <svg viewBox="0 0 64 64" className="glyph">
          <path d="M18 28a12 12 0 0 1 22-7 9 9 0 0 1 10 9 8 8 0 0 1-2 16H18a10 10 0 0 1 0-18z" className="glyph__fill" />
          <polygon points="34,42 26,54 32,54 28,62 40,48 33,48" className="glyph__bolt" />
        </svg>
      );
    case "Snow":
      return (
        <svg viewBox="0 0 64 64" className="glyph">
          <path d="M18 26a12 12 0 0 1 22-7 9 9 0 0 1 10 9 8 8 0 0 1-2 16H18a10 10 0 0 1 0-18z" className="glyph__fill" />
          {[20, 32, 44].map((x) => (
            <g key={x} className="glyph__ray">
              <line x1={x} y1="46" x2={x} y2="58" />
              <line x1={x - 4} y1="49" x2={x + 4} y2="55" />
              <line x1={x + 4} y1="49" x2={x - 4} y2="55" />
            </g>
          ))}
        </svg>
      );
    case "Mist":
    case "Fog":
    case "Haze":
      return (
        <svg viewBox="0 0 64 64" className="glyph">
          {[22, 30, 38].map((y, i) => (
            <line key={y} x1={12 + (i % 2) * 4} y1={y} x2="52" y2={y} className="glyph__ray" />
          ))}
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" className="glyph">
          <path d="M18 30a12 12 0 0 1 22-7 9 9 0 0 1 10 9 8 8 0 0 1-2 16H18a10 10 0 0 1 0-18z" className="glyph__fill" />
        </svg>
      );
  }
}

export default function WeatherCard({ weather, units }) {
  if (!weather) return null;

  const skyClass = conditionToSky[weather.condition] || "sky--clouds";
  const unitLabel = units === "metric" ? "°C" : "°F";
  const speedLabel = units === "metric" ? "m/s" : "mph";

  return (
    <section className={`reading ${skyClass}`}>
      <div className="reading__header">
        <div>
          <h2 className="reading__city">
            {weather.city}
            {weather.country ? <span className="reading__country">, {weather.country}</span> : null}
          </h2>
          <p className="reading__desc">{weather.description}</p>
        </div>
        <ConditionGlyph condition={weather.condition} />
      </div>

      <div className="reading__temp">
        {weather.temperature}
        <span className="reading__unit">{unitLabel}</span>
      </div>
      <div className="reading__feels">Feels like {weather.feelsLike}{unitLabel}</div>

      <div className="reading__gauges">
        <div className="gauge">
          <div className="gauge__label">Humidity</div>
          <div className="gauge__value">{weather.humidity}%</div>
        </div>
        <div className="gauge">
          <div className="gauge__label">Wind</div>
          <div className="gauge__value">
            {weather.windSpeed} {speedLabel}
          </div>
        </div>
        <div className="gauge">
          <div className="gauge__label">Pressure</div>
          <div className="gauge__value">{weather.pressure} hPa</div>
        </div>
      </div>
    </section>
  );
}
