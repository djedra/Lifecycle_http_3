export function MessageInput({
  inputValue,
  setInputValue,
  isSending,
  sendMessage
}) {
  return (
    <form onSubmit={sendMessage} className="message-form">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Type your message..."
        required
        disabled={isSending}
      />
      <button 
        type="submit" 
        disabled={isSending || !inputValue.trim()}
        className={isSending ? 'sending' : ''}
      >
        {isSending ? (
          <>
            <span className="spinner"></span>
            Sending...
          </>
        ) : (
          'Send'
        )}
      </button>
    </form>
  );
}