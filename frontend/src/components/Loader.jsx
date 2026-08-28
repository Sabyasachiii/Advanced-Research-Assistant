/**
 * variant="fullpage" (default) -> full-screen loader used while Chat.jsx loads a project.
 * variant="inline"             -> loader used inside the Dashboard project grid.
 */
export default function Loader({ variant = "fullpage", title, message }) {
  if (variant === "inline") {
    return (
      <div className="empty-state loading-state">
        <div className="loading-core">
          <span>◉</span>
        </div>

        <div className="loading-lines">
          <div />
          <div />
          <div />
        </div>

        <h3>{title || "INITIALIZING RESEARCH ENVIRONMENT"}</h3>
        <p>{message || "Establishing connection with the neural core..."}</p>
      </div>
    );
  }

  return (
    <div className="chat-loading">
      <div className="chat-loading-core">◈</div>
      <div className="chat-loading-line">{title || "INITIALIZING NEURAL CORE"}</div>
      <p>{message || "Loading research environment..."}</p>
    </div>
  );
}
