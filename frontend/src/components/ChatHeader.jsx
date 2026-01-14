export function ChatHeader() {
  return (
    <div className="chat-header">
      <h1>Anonymous Chat</h1>
      <div className="connection-status">
        <span className="status-dot"></span>
        <span>Online</span>
      </div>
    </div>
  );
}