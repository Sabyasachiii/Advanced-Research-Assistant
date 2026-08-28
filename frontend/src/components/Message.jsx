export default function Message({ message, username }) {
  const isUser = message.role === "user";

  return (
    <div className={`message-row ${isUser ? "user-message" : "assistant-message"}`}>
      <div className="message-avatar">
        {isUser ? username?.charAt(0)?.toUpperCase() || "U" : "◈"}
      </div>

      <div className="message-content">
        <div className="message-meta">
          <span>{isUser ? "YOU" : "NEURAL CORE"}</span>
          <small>{isUser ? "QUERY" : "AI RESPONSE"}</small>
        </div>

        <div className={`message-bubble ${message.error ? "message-error" : ""}`}>
          {message.content}
        </div>

        {!isUser && message.sources?.length > 0 && (
          <details className="sources-container">
            <summary>
              <span>⌬</span>
              SOURCES
              <b>{message.sources.length}</b>
              <span className="source-arrow">↓</span>
            </summary>

            <div className="sources-list">
              {message.sources.map((source, index) => (
                <div className="source-item" key={index}>
                  <div className="source-number">{String(index + 1).padStart(2, "0")}</div>
                  <div className="source-text">{source}</div>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
