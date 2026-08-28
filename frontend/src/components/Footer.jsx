/**
 * Reusable auth-page footer.
 * variant="status" (default) -> the small centered system-status line used on Login.
 * variant="full"             -> the justified copyright + status line used on Register.
 */
export default function Footer({ variant = "status" }) {
  if (variant === "full") {
    return (
      <footer className="auth-footer">
        <span>NEURAL AI LAB © 2026</span>
        <span>
          <i />
          ALL SYSTEMS OPERATIONAL
        </span>
      </footer>
    );
  }

  return (
    <div className="auth-system-status">
      <span className="status-dot" />
      NEURAL CORE ONLINE
      <span className="status-divider" />
      SECURE CONNECTION
    </div>
  );
}
