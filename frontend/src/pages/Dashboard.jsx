import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

import Header from "../components/Header";
import ProjectCard from "../components/ProjectCard";
import Loader from "../components/Loader";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  // ---------------------------------
  // Load Projects
  // ---------------------------------

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await API.get("/projects/");
      setProjects(response.data);
    } catch (error) {
      console.error("Failed to load projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------
  // Create Project
  // ---------------------------------

  const createProject = async () => {
    if (!projectName.trim()) {
      return;
    }

    setCreating(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Your session has expired. Please login again.");
        navigate("/");
        return;
      }

      const payload = JSON.parse(atob(token.split(".")[1]));

      await API.post("/projects/", {
        title: projectName.trim(),
        description: description.trim(),
        owner_id: payload.user_id,
      });

      setProjectName("");
      setDescription("");
      setShowModal(false);

      await loadProjects();
    } catch (error) {
      console.error("Project creation failed:", error);
      alert(error.response?.data?.detail || "Unable to create research project.");
    } finally {
      setCreating(false);
    }
  };

  // ---------------------------------
  // Close Modal
  // ---------------------------------

  const closeModal = () => {
    if (creating) return;

    setShowModal(false);
    setProjectName("");
    setDescription("");
  };

  // ---------------------------------
  // Render
  // ---------------------------------

  return (
    <div className="lab-dashboard">
      <div className="lab-grid" />
      <div className="dashboard-glow dashboard-glow-one" />
      <div className="dashboard-glow dashboard-glow-two" />

      <Header />

      <main className="lab-main">
        <section className="lab-hero">
          <div className="hero-content">
            <div className="eyebrow">
              <span>✦</span>
              RESEARCH CONTROL CENTER
            </div>

            <h2>
              Welcome back,
              <span> {user?.username || "Researcher"}</span>
            </h2>

            <p>
              Manage your research environments, analyze documents, and interact with
              your AI-powered research core.
            </p>
          </div>

          <button className="new-project-button" onClick={() => setShowModal(true)}>
            <span className="new-project-icon">＋</span>
            <span>NEW RESEARCH</span>
            <span className="button-arrow">→</span>
          </button>
        </section>

        <section className="lab-stats">
          <div className="stat-card">
            <div className="stat-icon">◈</div>
            <div className="stat-content">
              <span>ACTIVE PROJECTS</span>
              <strong>{projects.length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">⌬</div>
            <div className="stat-content">
              <span>AI CORE</span>
              <strong className="online-text">ONLINE</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">◇</div>
            <div className="stat-content">
              <span>RESEARCH MODE</span>
              <strong>RAG</strong>
            </div>
          </div>
        </section>

        <section className="projects-section">
          <div className="section-heading">
            <div>
              <div className="section-label">RESEARCH ENVIRONMENTS</div>
              <h3>Your Projects</h3>
            </div>

            <div className="project-count">
              <span className="count-dot" />
              {projects.length} PROJECT{projects.length !== 1 ? "S" : ""}
            </div>
          </div>

          {loading && <Loader variant="inline" />}

          {!loading && projects.length === 0 && (
            <div className="empty-state">
              <div className="empty-core">◈</div>
              <div className="empty-label">NO ACTIVE ENVIRONMENTS</div>
              <h3>Start your first research project</h3>

              <p>
                Create a research environment, upload documents, and let the AI
                research core help you investigate your subject.
              </p>

              <button className="new-project-button small" onClick={() => setShowModal(true)}>
                <span>＋</span>
                CREATE FIRST PROJECT
                <span>→</span>
              </button>
            </div>
          )}

          {!loading && projects.length > 0 && (
            <div className="project-grid">
              {projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  onClick={() => navigate(`/chat/${project.id}`)}
                />
              ))}

              <button className="project-add-card" onClick={() => setShowModal(true)}>
                <div className="add-card-icon">＋</div>
                <strong>NEW RESEARCH</strong>
                <span>Create another research environment</span>
              </button>
            </div>
          )}
        </section>
      </main>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="research-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="section-label">NEW ENVIRONMENT</div>
                <h2>Create Research Project</h2>
                <p>Initialize a new AI-powered research environment.</p>
              </div>

              <button className="modal-close" onClick={closeModal} disabled={creating}>
                ×
              </button>
            </div>

            <div className="modal-core">
              <span>◈</span>
            </div>

            <div className="modal-field">
              <label htmlFor="project-name">PROJECT NAME</label>
              <input
                id="project-name"
                type="text"
                placeholder="e.g. Artificial Intelligence Research"
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                disabled={creating}
                autoFocus
              />
            </div>

            <div className="modal-field">
              <label htmlFor="project-description">DESCRIPTION</label>
              <textarea
                id="project-description"
                placeholder="Describe what you want to research..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                disabled={creating}
                rows={4}
              />
            </div>

            <div className="modal-actions">
              <button className="cancel-button" onClick={closeModal} disabled={creating}>
                CANCEL
              </button>

              <button
                className="create-button"
                onClick={createProject}
                disabled={creating || !projectName.trim()}
              >
                {creating ? (
                  <>
                    <span className="button-loader" />
                    INITIALIZING...
                  </>
                ) : (
                  <>
                    INITIALIZE RESEARCH
                    <span>→</span>
                  </>
                )}
              </button>
            </div>

            <div className="modal-security">
              <span className="security-dot" />
              SECURE RESEARCH ENVIRONMENT
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
