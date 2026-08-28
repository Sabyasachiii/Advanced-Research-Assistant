import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await register(form.username, form.email, form.password);
      alert("Registration successful!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="neural-auth-page">
      <div className="neural-grid" />
      <div className="neural-glow glow-one" />
      <div className="neural-glow glow-two" />

      <header className="auth-brand">
        <div className="auth-brand-icon">◈</div>
        <div className="auth-brand-text">
          <h1>NEURAL AI LAB</h1>
          <span>ADVANCED RESEARCH ASSISTANT</span>
        </div>
      </header>

      <main className="auth-main">
        <section className="auth-intro">
          <div className="system-label">
            <span className="online-dot" />
            RESEARCH PLATFORM
          </div>

          <h2>
            Build your
            <br />
            <span>research space.</span>
          </h2>

          <p>
            Create your personal research environment and unlock AI-powered document
            analysis, retrieval and investigation.
          </p>

          <div className="auth-features">
            <div className="auth-feature">
              <div className="feature-icon">◇</div>
              <div className="feature-content">
                <strong>PRIVATE WORKSPACES</strong>
                <span>Keep your research projects organized in dedicated environments.</span>
              </div>
            </div>

            <div className="auth-feature">
              <div className="feature-icon">⌬</div>
              <div className="feature-content">
                <strong>AI RESEARCH CORE</strong>
                <span>Ask questions and retrieve insights directly from your documents.</span>
              </div>
            </div>

            <div className="auth-feature">
              <div className="feature-icon">◈</div>
              <div className="feature-content">
                <strong>DOCUMENT INTELLIGENCE</strong>
                <span>Upload research material and build searchable knowledge bases.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-panel">
          <div className="auth-panel-header">
            <div>
              <div className="panel-label">NEW RESEARCHER</div>
              <h3>Create Account</h3>
              <p>Initialize your Neural AI Lab account.</p>
            </div>

            <div className="panel-core">◈</div>
          </div>

          {error && (
            <div className="auth-error">
              <span>!</span>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">USERNAME</label>
              <div className="register-input-wrapper">
                <span className="register-input-icon">◇</span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="email">EMAIL ADDRESS</label>
              <div className="register-input-wrapper">
                <span className="register-input-icon">@</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="researcher@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">PASSWORD</label>
              <div className="register-input-wrapper">
                <span className="register-input-icon">◆</span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a secure password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="button-loader" />
                  CREATING ACCOUNT...
                </>
              ) : (
                <>
                  INITIALIZE ACCOUNT
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span />
            <small>ALREADY REGISTERED?</small>
            <span />
          </div>

          <div className="register-prompt">
            <span>Already have an account?</span>
            <Link to="/">Return to Login →</Link>
          </div>

          <div className="security-status">
            <span className="security-dot" />
            SECURE RESEARCH ENVIRONMENT
          </div>
        </section>
      </main>

      <Footer variant="full" />
    </div>
  );
}
