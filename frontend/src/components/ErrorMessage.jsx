export default function ErrorMessage({ message }) {
  if (!message) return null;
  return (
    <div className="error-panel" role="alert">
      <span className="error-panel__mark">!</span>
      <span>{message}</span>
    </div>
  );
}
