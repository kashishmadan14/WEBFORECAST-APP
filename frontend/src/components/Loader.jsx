export default function Loader() {
  return (
    <div className="loader" role="status" aria-live="polite">
      <div className="loader__needle" />
      <span className="loader__label">Taking a reading…</span>
    </div>
  );
}
