import { useEffect, useRef } from 'react';

export function MessageList({ messages, userId }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateUserColor = (id) => {
    const hash = Array.from(id).reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    return `hsl(${Math.abs(hash % 360)}, 70%, 60%)`;
  };

  return (
    <div className="messages-container">
      {messages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">💬</div>
          <p>No messages yet</p>
          <p>Be the first to say something!</p>
        </div>
      ) : (
        messages.map((message) => (
          <div 
            key={message.id}
            className={`message ${message.userId === userId ? 'my-message' : 'other-message'}`}
            style={{
              '--user-color': generateUserColor(message.userId),
            }}
          >
            <div className="message-content">{message.content}</div>
            <div className="message-meta">
              <span className="message-time">
                {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
              <span className="message-user-id">
                {message.userId === userId ? 'You' : message.userId.substring(0, 8)}
              </span>
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}