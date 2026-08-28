import { useEffect, useRef } from "react";
import Message from "./Message";

const SUGGESTIONS = [
  "Summarize the main findings.",
  "What are the key points in these documents?",
  "What conclusions can be drawn?",
];

export default function ChatWindow({ messages, sending, user, onSuggestion }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  return (
    <div className="chat-messages">
      {messages.length === 0 ? (
        <div className="chat-empty">
          <div className="empty-neural-core">◈</div>
          <div className="empty-label">NEURAL CORE READY</div>

          <h2>What would you like to research?</h2>

          <p>
            Ask questions about your uploaded documents. The AI research core will
            retrieve relevant information from your knowledge base.
          </p>

          <div className="suggested-questions">
            {SUGGESTIONS.map((text, index) => (
              <button key={text} onClick={() => onSuggestion(text)}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {text}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="message-container">
          {messages.map((message, index) => (
            <Message key={index} message={message} username={user?.username} />
          ))}

          {sending && (
            <div className="message-row assistant-message">
              <div className="message-avatar">◈</div>

              <div className="message-content">
                <div className="message-meta">
                  <span>NEURAL CORE</span>
                  <small>PROCESSING</small>
                </div>

                <div className="thinking-bubble">
                  <span />
                  <span />
                  <span />
                  <em>RETRIEVING KNOWLEDGE...</em>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
