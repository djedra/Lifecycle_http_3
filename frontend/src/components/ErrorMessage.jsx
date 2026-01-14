export function ErrorMessage({ error, onDismiss }) {
  if (!error) return null;
  return (
    <div className="error-message">
      ⚠️ {error}
      <button className="dismiss-btn" onClick={onDismiss}>×</button>
    </div>
  );
}