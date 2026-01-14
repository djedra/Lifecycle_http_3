export function UserControls({
  userId,
  impersonateId,
  setImpersonateId,
  handleImpersonate
}) {
  return (
    <div className="user-controls">
      <div className="user-id">
        <span className="user-label">Your ID:</span>
        <span className="user-value">{userId}</span>
        <button 
          className="copy-btn"
          onClick={() => {
            navigator.clipboard.writeText(userId);
          }}
          title="Copy to clipboard"
        >
          📋
        </button>
      </div>
      <div className="impersonate-controls">
        <input
          type="text"
          value={impersonateId}
          onChange={(e) => setImpersonateId(e.target.value)}
          placeholder="Enter user ID to impersonate"
        />
        <button 
          onClick={handleImpersonate}
          disabled={!impersonateId.trim()}
        >
          Impersonate
        </button>
      </div>
    </div>
  );
}