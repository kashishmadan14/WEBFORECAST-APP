export default function RecentSearches({ history, onSelect }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="history">
      <div className="history__label">Recent readings</div>
      <div className="history__chips">
        {history.map((entry, idx) => (
          <button
            key={`${entry.city}-${idx}`}
            className="history__chip"
            onClick={() => onSelect(entry.city)}
            type="button"
          >
            {entry.city}
            {entry.temperature != null ? ` · ${entry.temperature}°` : ""}
          </button>
        ))}
      </div>
    </div>
  );
}
