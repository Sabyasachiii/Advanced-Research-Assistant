import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-grid" />
      <div className="auth-glow auth-glow-one" />
      <div className="auth-glow auth-glow-two" />

      <div className="auth-wrapper">
        <div className="auth-brand">
          <div className="auth-brand-core">◈</div>
          <div>
            <h1>NEURAL LAB</h1>
            <span>Advanced Research Assistant</span>
          </div>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="auth-card-header">
            <div className="section-label">RESEARCH ACCESS</div>
            <h2>Welcome back</h2>
            <p>Sign in to access your research environments and AI assistant.</p>
          </div>

          {error && (
            <div className="auth-error">
              <span>!</span>
              {error}
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="email">EMAIL ADDRESS</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">@</span>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="researcher@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="password">PASSWORD</label>
            <div className="auth-input-wrapper">
              <span className="auth-input-icon">◆</span>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="auth-spinner" />
                AUTHENTICATING...
              </>
            ) : (
              <>
                ACCESS NEURAL LAB
                <span>→</span>
              </>
            )}
          </button>

          <div className="auth-footer">
            <span>NEW RESEARCHER?</span>
            <Link to="/register">CREATE ACCOUNT →</Link>
          </div>
        </form>

        <Footer />
      </div>
    </div>
  );
}
