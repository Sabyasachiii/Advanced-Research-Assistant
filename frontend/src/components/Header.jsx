import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Shared app header.
 * - Pass no props for the plain "dashboard" header.
 * - Pass `project` + `onBack` to render the "chat" header (back button + active project pill).
 */
export default function Header({ project, onBack }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isChatMode = Boolean(onBack);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className={isChatMode ? "chat-header" : "lab-header"}>
      <div
        className={isChatMode ? "chat-brand" : "brand"}
        onClick={!isChatMode ? () => navigate("/dashboard") : undefined}
      >
        {isChatMode && (
          <button className="back-button" onClick={onBack} title="Back to Dashboard">
            ←
          </button>
        )}

        <div className={isChatMode ? "chat-brand-icon" : "brand-core"}>◈</div>

        <div className={isChatMode ? undefined : "brand-text"}>
          <h1>{isChatMode ? "NEURAL AI LAB" : "NEURAL LAB"}</h1>
          <span>ADVANCED RESEARCH ASSISTANT</span>
        </div>
      </div>

      {isChatMode && (
        <div className="chat-project">
          <span className="chat-project-label">ACTIVE ENVIRONMENT</span>
          <strong>{project?.title || "Research Project"}</strong>
        </div>
      )}

      <div className={isChatMode ? "chat-header-right" : "header-right"}>
        <div className={isChatMode ? "chat-system-status" : "system-status"}>
          <span className="online-dot" />
          SYSTEM ONLINE
        </div>

        <div className={isChatMode ? "chat-user" : "user-info"}>
          <div className={isChatMode ? "chat-avatar" : "user-avatar"}>
            {user?.username?.charAt(0)?.toUpperCase() || "R"}
          </div>

          {isChatMode ? (
            <span>{user?.username}</span>
          ) : (
            <div className="user-details">
              <strong>{user?.username || "Researcher"}</strong>
              <small>RESEARCHER</small>
            </div>
          )}
        </div>

        <button className={isChatMode ? "chat-logout" : "logout-button"} onClick={handleLogout}>
          {!isChatMode && <span>↪</span>}
          LOGOUT
        </button>
      </div>
    </header>
  );
}
