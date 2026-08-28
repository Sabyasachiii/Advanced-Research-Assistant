export default function ChatInput({ question, setQuestion, onSend, sending, documentsCount }) {
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <div className="chat-input-area">
      <div className="input-status">
        <span className="online-dot" />
        <span>NEURAL CORE READY</span>
        <span className="input-divider" />
        <span>
          {documentsCount} DOCUMENT{documentsCount !== 1 ? "S" : ""} INDEXED
        </span>
      </div>

      <div className="chat-input-wrapper">
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask the research core anything..."
          rows={1}
          disabled={sending}
        />

        <button className="send-button" onClick={onSend} disabled={!question.trim() || sending}>
          {sending ? (
            <span className="button-loader" />
          ) : (
            <>
              SEND
              <span>→</span>
            </>
          )}
        </button>
      </div>

      <div className="input-hint">
        PRESS <kbd>ENTER</kbd> TO SEND
        <span />
        SHIFT + ENTER FOR NEW LINE
      </div>
    </div>
  );
}
