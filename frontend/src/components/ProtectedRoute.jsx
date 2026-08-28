import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

/**
 * Used as a layout route so any nested routes require a logged-in user:
 *
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *     <Route path="/chat/:projectId" element={<Chat />} />
 *   </Route>
 *
 * Assumes AuthContext exposes `user` and an `initializing` flag while it checks
 * localStorage/token validity on first load. Rename `initializing` below if your
 * AuthContext calls it something else (e.g. `loading`).
 */
export default function ProtectedRoute() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <div className="neural-chat-page">
        <div className="chat-grid" />
        <Loader title="VERIFYING SESSION" message="Checking your credentials..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
